defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{Repo, Post, Voting, User}
  alias __MODULE__.PostWithVotingScore
  import Ecto.Query

  defmodule PostWithVotingScore do
    defstruct [:id, :inserted_at, :message, :parent_id, :voting_score]

    def from_posts(posts) when is_list(posts) do
      posts |> Enum.map(&from_post/1)
    end

    def from_post(%Post{votings: votings} = post) when is_list(votings) do
      %__MODULE__{id: post.id, inserted_at: post.inserted_at, message: post.message, parent_id: post.parent_id, voting_score: calculate_voting_score(votings)}
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

  def list_threads(_, _, _) do
    {:ok, Post |> init_posts_query |> Post.parents |> Repo.all |> PostWithVotingScore.from_posts}
  end

  def find_thread(_parent, %{id: id}, _resolution) do
    {:ok, Post |> init_posts_query |> Repo.get!(id) |> PostWithVotingScore.from_post}
  end


  def list_posts(_parent, _args, _resolution) do
    {:ok, Post |> init_posts_query |> Repo.all |> PostWithVotingScore.from_posts}
  end

  def list_thread_posts(%Post{} = post, args, resolution) do
    list_thread_posts(PostWithVotingScore.from_post(post), args, resolution)
  end

  def list_thread_posts(%PostWithVotingScore{} = post, _args, _resolution) do
    {:ok, Post |> init_posts_query |> where([p], p.parent_id == ^post.id) |> Repo.all |> PostWithVotingScore.from_posts}
  end

  def vote_post(_parent, %{id: id, score: score}, _resolution) do
    post = Post |> Repo.get!(id)

    %Voting{inserted_at: Calendar.DateTime.now_utc, post_id: post.id}
    |> Voting.changeset(%{score: safer_score(score)})
    |> Repo.insert!

    {
      :ok, 
      Post |> init_posts_query |> Repo.get!(id) |> PostWithVotingScore.from_post
    }
  end

  defp safer_score(score) when score >= 0, do: 1
  defp safer_score(score) when score < 0, do: -1


  defp init_posts_query(queryable) do
    queryable |> from(preload: [votings: []])
  end


end
