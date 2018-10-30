defmodule Openjodel.Streams.Query do
  alias Openjodel.{
    Repo,
    Post,
    Stream
  }

  import Geo.PostGIS
  import Ecto.Query

  def all do
    Stream
    |> Repo.all
  end

  def find(id) do
    Stream |> Repo.get(id)
  end

  @doc """
  Returns array of streams without any new posts in given number of days.
  """
  def unused_for_days_query(days) do
    negated_days = days * -1    

    from(
      s in Stream, 
      left_join: sp in assoc(s, :stream_posts), 
      group_by: [s.id], 
      having: max(sp.inserted_at) < datetime_add(^NaiveDateTime.utc_now, ^negated_days, "day")
    ) 
  end

  def containing_position(%Geo.Point{} = geog) do
    # TODO: replace magic value 500 (stream radius)
    Stream
    |> from
    |> where([s], st_dwithin(s.geog, ^geog, 500))
    |> Repo.all
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
