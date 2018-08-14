defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{Repo, Post, Voting, User}
  import Ecto.Query

  def signup(_, _, _) do
    # create new user
    user = User.with_token |> User.changeset(%{}) |> Repo.insert!()

    {:ok, user}
  end

  def login(_, %{token: token}, _) do
    {:ok, User |> where([u], u.token == ^token) |> Repo.one!}
  end

  def list_threads(_, _, _) do
    {:ok, Post |> Post.parents |> Repo.all}
  end

  def find_thread(_parent, %{id: id}, _resolution) do
    {:ok, Post |> Repo.get!(id)}
  end


  def list_posts(_parent, _args, _resolution) do
    {:ok, Post |> Repo.all}
  end

  def list_thread_posts(%Post{} = post, _args, _resolution) do
    {:ok, Post |> where([p], p.parent_id == ^post.id) |> Repo.all}
  end
end
