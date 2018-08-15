defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{Repo, Post, Voting, User}
  alias __MODULE__.PostWithVotingScore
  import Ecto.Query

  defmodule PostWithVotingScore do
    defstruct [:id, :inserted_at, :message, :parent_id, :voting_score, :current_user_voting_score]

    def from_posts(posts, %User{} = user \\ nil) when is_list(posts) do
      posts |> Enum.map(&(from_post(&1, user)))
    end
    

    def from_post(%Post{votings: votings} = post, %User{id: current_user_id}) when is_list(votings) do
      %__MODULE__{from_post(post) | current_user_voting_score: user_voting_score(votings, current_user_id)}
    end

    def from_post(%Post{votings: votings} = post) when is_list(votings) do
      %__MODULE__{id: post.id, inserted_at: post.inserted_at, message: post.message, parent_id: post.parent_id, voting_score: calculate_voting_score(votings)}
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

  def create_thread(_, %{message: message}, %{context: %{current_user: current_user}}) do
    {:ok, %Post{inserted_at: Calendar.DateTime.now_utc, message: message} |> Post.changeset(%{message: message}) |> Repo.insert! }
  end

  def list_threads(_, _, %{context: %{current_user: current_user}}) do
    {:ok, Post |> init_posts_query |> Post.parents |> Repo.all |> PostWithVotingScore.from_posts(current_user)}
  end

  def find_thread(_parent, %{id: id}, %{context: %{current_user: current_user}}) do
    {:ok, Post |> init_posts_query |> Repo.get!(id) |> PostWithVotingScore.from_post(current_user)}
  end


  def list_posts(_parent, _, %{context: %{current_user: current_user}}) do
    {:ok, Post |> init_posts_query |> Repo.all |> PostWithVotingScore.from_posts(current_user)}
  end
  def list_thread_posts(post, _, %{context: %{current_user: current_user}}) do
    {:ok, Post |> init_posts_query |> where([p], p.parent_id == ^post.id) |> Repo.all |> PostWithVotingScore.from_posts(current_user)}
  end

  
  def list_thread_posts(post, args, %{context: context}) do
    IO.inspect("list_thread_posts ...")
    IO.inspect(context)
    list_thread_posts(post, args, %{context: context})
  end



  def vote_post(_parent, %{id: id, score: score}, %{context: %{current_user: current_user}}) do
    post = Post |> Repo.get!(id)

    # TODO: possible locking problem?? (same user updates same post's vote at the same time)
    case Repo.get_by(Voting, user_id: current_user.id, post_id: post.id) do
      nil -> %Voting{user_id: current_user.id, post_id: post.id}
      voting -> voting
    end
    |> Map.put(:inserted_at, Calendar.DateTime.now_utc)
    |> Voting.changeset(%{score: safer_score(score) |> IO.inspect})
    |> Repo.insert_or_update!

    {
      :ok, 
      Post |> init_posts_query |> Repo.get!(id) |> PostWithVotingScore.from_post(current_user)
    }
  end

  defp safer_score(score) when score > 0, do: 1
  defp safer_score(score) when score < 0, do: -1
  defp safer_score(score), do: 0


  defp init_posts_query(queryable) do
    queryable |> from(preload: [votings: []])
  end


end
