defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{Repo, Post, Voting, User, PaginatedPosts}
  alias Openjodel.Processes
  alias __MODULE__.PostWithVotingScore
  import Ecto.Query

  defmodule PostWithVotingScore do
    defstruct [:id, :inserted_at, :message, :parent_id, :participant, :voting_score, :current_user_voting_score]

    def from_posts(posts, %User{} = user \\ nil) when is_list(posts) do
      posts |> Enum.map(&(from_post(&1, user)))
    end
    

    def from_post(%Post{votings: votings} = post, %User{id: current_user_id}) when is_list(votings) do
      %__MODULE__{from_post(post) | current_user_voting_score: user_voting_score(votings, current_user_id)}
    end

    def from_post(%Post{votings: votings} = post) when is_list(votings) do
      %__MODULE__{id: post.id, inserted_at: post.inserted_at, message: post.message, participant: post.participant, parent_id: post.parent_id, voting_score: calculate_voting_score(votings)}
    end

    def user_voting_score(votings, user_id) do
      votings
      |> Enum.filter(fn voting -> voting.user_id == user_id end)
      |> Enum.map(fn voting -> voting.score end)
      |> Enum.at(0)
    end

    def calculate_voting_score(votings) do
      votings 
      |> Enum.map(fn vote -> vote.score end)
      |> Enum.sum()
    end
  end
  
  def signup(_, _, _) do
    # create new user
    user = User.with_token |> User.changeset(%{}) |> Repo.insert!()

    {:ok, user}
  end

  def login(_, %{token: token}, _) do
    {:ok, User |> where([u], u.token == ^token) |> Repo.one!}
  end

  def create_thread(_, post_attrs, %{context: %{current_user: current_user}}) do
    Processes.Thread.start_thread(current_user, post_attrs)
    |> case do
      {:ok, thread} -> {:ok, thread}
      {:error, _} -> throw("Unable to create thread (TODO: add proper error handling)")
    end
  end

  def create_post(_, post_attrs, %{context: %{current_user: current_user}}) do
    Processes.Thread.add_post(current_user, post_attrs)
    |> case do
      {:ok, post} -> {:ok, post}
      {:error, _} -> throw("Unable to create post (TODO: add proper error handling)")
    end
  end

  def list_threads(_, arguments, %{context: %{current_user: current_user}}) do
    cursor = arguments
             |> case do
               %{cursor: cursor} -> cursor
               _ -> %{}
             end
    %{entries: threads, metadata: metadata} = Post
              |> init_posts_query
              |> Post.parents
              |> Repo.paginate(cursor_fields: [:inserted_at, :id], sort_direction: :desc, limit: cursor[:limit] || 50, before: cursor[:before], after: cursor[:after])

    IO.inspect("======== list_threads ===========")
    IO.inspect(cursor)
    IO.inspect(metadata)
              
    threads_with_voting_scores = PostWithVotingScore.from_posts(threads, current_user)

    {:ok, Openjodel.PaginatedPosts.from_pagination(threads_with_voting_scores, metadata)}
  end

  def find_thread(_parent, %{id: id}, %{context: %{current_user: current_user}}) do
    {:ok, Post |> init_posts_query |> Repo.get!(id) |> PostWithVotingScore.from_post(current_user)}
  end

  # transform resource (from subscription trigger) for current user
  def resource_for_user(%Post{id: id}, _, %{context: %{current_user: current_user}}) do
    {:ok, Post |> init_posts_query |> Repo.get!(id) |> PostWithVotingScore.from_post(current_user)}
  end

  def resource_for_user(%PostWithVotingScore{id: id}, args, context) do
    resource_for_user(%Post{id: id}, args, context)
  end

  def list_thread_posts(%{id: thread_id}, arguments, %{context: %{current_user: current_user}}) do
    cursor = arguments
             |> case do
               %{cursor: cursor} -> cursor
               _ -> %{}
             end

    %{entries: posts, metadata: metadata} = Post
    |> init_posts_query(reverse_order: true)
    |> where([p], p.parent_id == ^thread_id)
    |> Repo.paginate(cursor_fields: [:inserted_at, :id], sort_direction: :asc, limit: cursor[:limit] || 50, before: cursor[:before], after: cursor[:after])

    IO.inspect("list_thread_posts")
    IO.inspect(cursor)

    posts_with_voting_scores = PostWithVotingScore.from_posts(posts, current_user)

    {:ok, Openjodel.PaginatedPosts.from_pagination(posts_with_voting_scores, metadata)}
  end

  def vote_post(_parent, %{id: id, score: score}, %{context: %{current_user: current_user}}) do
    Processes.Thread.vote_post(current_user, %{post_id: id, score: score})
    |> case do
      {:ok, _} = result -> result
      {:error, _} -> throw("Unable to vote post (TODO: add proper error handling)")
    end

    {
      :ok, 
      Post |> init_posts_query |> Repo.get!(id) |> PostWithVotingScore.from_post(current_user)
    }
  end


  def init_posts_query(queryable, opts \\ []) do
    order_by = case opts[:reverse_order] do
      true -> [asc: :inserted_at, asc: :id]
      _ -> [desc: :inserted_at, desc: :id]
    end

  
    queryable |> from(preload: [votings: [], participant: []], order_by: ^order_by)
  end


  # TODO: participant not fetched everytime
end