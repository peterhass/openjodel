defmodule Openjodel.CleanupJob do
  alias Openjodel.Stream
  alias Openjodel.Streams.Query, as: StreamsQuery
  alias Openjodel.Repo
  import Ecto.Query


  def cleanup do
    query = StreamsQuery.unused_for_days_query(30)
    |> select([s], s.id)

    from(s in Stream, inner_join: ns in subquery(query), on: ns.id == s.id)
    |> Repo.delete_all

    # TODO: clean up posts without stream at some point ...
  end
end
