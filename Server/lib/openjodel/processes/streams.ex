defmodule Openjodel.Processes.Streams do
  alias Openjodel.Repo
  alias Openjodel.Post
  alias Openjodel.Stream

  # TODO: move to some other layer
  def find_stream(id) do
    Stream |> Repo.get(id)
  end
  
  def add_post_to_streams(%Post{id: post_id}) do
    add_post_to_streams(post_id)
  end

  @doc """

  Returns array of stream ids the post got attached to.
  """
  def add_post_to_streams(post_id) do
    max_distance = 500

    sql = "insert into stream_posts(stream_id, post_id, inserted_at) select streams.id, posts.id, posts.inserted_at from streams, posts where posts.id=$1 AND ST_DWithin(posts.geog, streams.geog, $2) returning *"
    params = [post_id, max_distance]

    result = Ecto.Adapters.SQL.query!(Repo, sql, params)

    updated_stream_ids = result.rows
    |> Enum.map(&Enum.zip(result.columns, &1))
    |> Enum.map(&Enum.into(&1, %{}))
    |> Enum.map(&Map.fetch!(&1, "stream_id"))
  end

  def streams_containing_post(%Post{id: post_id}) do
    streams_containing_post(post_id)
  end

  @doc """

  Returns array of stream ids the post is attached to.
  """
  def streams_containing_post(post_id) do
    %{rows: rows}= Ecto.Adapters.SQL.query!(Openjodel.Repo, "select stream_id from stream_posts where post_id = $1", [post_id])
    
    updated_stream_ids = rows
     |> Enum.map(&Enum.at(&1, 0)) 
  end
end
