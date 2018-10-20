defmodule Openjodel.Streams.Query do
  alias Openjodel.{
    Repo,
    Post,
    Stream
  }

  def all do
    Stream
    |> Repo.all
  end

  def find(id) do
    Stream |> Repo.get(id)
  end

  def containing_post(%Post{id: post_id}) do
    containing_post(post_id)
  end

  @doc """

  Returns array of stream ids the post is attached to.
  """
  def containing_post(post_id) do
    %{rows: rows} =
      Ecto.Adapters.SQL.query!(Repo, "select stream_id from stream_posts where post_id = $1", [
        post_id
      ])

    rows
    |> Enum.map(&Enum.at(&1, 0))
  end
end
