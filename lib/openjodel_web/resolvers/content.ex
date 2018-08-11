defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{Repo, Post, Voting}
  import Ecto.Query

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
