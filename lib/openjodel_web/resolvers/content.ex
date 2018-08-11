defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{Repo, Post, Voting}
  import Ecto.Query

  def list_posts(_parent, _args, _resolution) do
    {:ok, Post |> Repo.all}
  end
end
