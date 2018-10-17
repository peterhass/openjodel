defmodule Openjodel.Streams.AttachPost do
  alias Openjodel.{
    Repo,
    Post,
    Stream
  }

  def attach_by_location(%Post{id: post_id}) do
    attach_by_location(post_id)
  end

  @doc """

  Returns array of stream ids the post got attached to.
  """
  def attach_by_location(post_id) do
    max_distance = 500

    sql =
      "insert into stream_posts(stream_id, post_id, inserted_at) select streams.id, posts.id, posts.inserted_at from streams, posts where posts.id=$1 AND ST_DWithin(posts.geog, streams.geog, $2) returning *"

    params = [post_id, max_distance]

    result = Ecto.Adapters.SQL.query!(Repo, sql, params)

    result.rows
    |> Enum.map(&Enum.zip(result.columns, &1))
    |> Enum.map(&Enum.into(&1, %{}))
    |> Enum.map(&Map.fetch!(&1, "stream_id"))
  end
end
