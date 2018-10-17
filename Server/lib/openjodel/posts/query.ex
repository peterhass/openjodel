defmodule Openjodel.Posts.Query do
  alias Openjodel.{
    Repo,
    Post,
    StreamPost,
    PaginatedPosts
  }

  import Ecto.Query

  def find(id) do
    Post
    |> init_query
    |> Repo.get(id)
  end

  def for_thread(thread_id) do
    Post
    |> init_query(reverse_order: true)
    |> where([p], p.parent_id == ^thread_id)
  end

  def paginated_for_thread(thread_id, cursor) do
    for_thread(thread_id)
    |> Repo.paginate(
      cursor_fields: [:inserted_at, :id],
      sort_direction: :asc,
      limit: cursor[:limit] || 50,
      before: cursor[:before],
      after: cursor[:after]
    )
    |> PaginatedPosts.from_pagination()
  end

  def for_stream(stream_id) do
    Post
    |> init_query
    |> Post.parents()
    |> join(:inner, [p], ps in StreamPost, p.id == ps.post_id and ps.stream_id == ^stream_id)
  end

  def paginated_for_stream(stream_id, cursor) do
    for_stream(stream_id)
    |> Repo.paginate(
      cursor_fields: [:inserted_at, :id],
      sort_direction: :desc,
      limit: cursor[:limit] || 50,
      before: cursor[:before],
      after: cursor[:after]
    )
    |> PaginatedPosts.from_pagination()
  end

  defp init_query(queryable, opts \\ []) do
    order_by =
      case opts[:reverse_order] do
        true -> [asc: :inserted_at, asc: :id]
        _ -> [desc: :inserted_at, desc: :id]
      end

    queryable |> from(preload: [votings: [], participant: []], order_by: ^order_by)
  end
end
