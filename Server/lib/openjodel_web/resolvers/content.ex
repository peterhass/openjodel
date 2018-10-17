defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{Repo, Post, Voting, User, PaginatedPosts, Stream, StreamPost}
  alias Openjodel.Processes
  alias OpenjodelWeb.Streams
  alias OpenjodelWeb.PostView
  import Ecto.Query

  def signup(_, _, _) do
    # create new user
    user = User.with_token |> User.changeset(%{}) |> Repo.insert!()

    {:ok, user}
  end

  def login(_, %{token: token}, _) do
    {:ok, User |> where([u], u.token == ^token) |> Repo.one!}
  end

  defp convert_post_attrs(post_attrs) do
    Map.merge(post_attrs, %{
      "geog": %{
        "coordinates" => post_attrs.geog,
        "type" => "Point",
        "srid" => 4326
      }
    })
  end

  def create_thread(_, post_attrs, %{context: %{current_user: current_user}}) do
    Processes.Thread.start_thread(current_user, convert_post_attrs(post_attrs))
    |> case do
      {:ok, thread} -> 
        Streams.Server.attach_thread(thread)
        {:ok, thread}
      {:error, e} -> throw(e)
    end
  end

  def create_post(_, post_attrs, %{context: %{current_user: current_user}}) do
    Processes.Thread.add_post(current_user, convert_post_attrs(post_attrs))
    |> case do
      {:ok, post} -> {:ok, post}
      {:error, e} -> throw(e)
    end
  end

  def list_threads(_, arguments, %{context: %{current_user: current_user}}) do
    cursor = arguments
             |> case do
               %{cursor: cursor} -> cursor
               _ -> %{}
             end
    stream_id = arguments
                |> case do
                  %{stream_id: stream_id} -> stream_id
                  _ -> nil
                end

    %{entries: threads, metadata: metadata} = Post
              |> init_posts_query
              |> Post.parents
              |> join(:inner, [p], ps in StreamPost, p.id == ps.post_id and ps.stream_id == ^stream_id)
              |> Repo.paginate(cursor_fields: [:inserted_at, :id], sort_direction: :desc, limit: cursor[:limit] || 50, before: cursor[:before], after: cursor[:after])

    IO.inspect("======== list_threads ===========")
    IO.inspect(cursor)
    IO.inspect(metadata)
              
    threads_with_voting_scores = PostView.from_posts(threads, current_user)

    {:ok, Openjodel.PaginatedPosts.from_pagination(threads_with_voting_scores, metadata)}
  end

  def find_thread(_parent, %{id: id}, %{context: %{current_user: current_user}}) do
    {:ok, Post |> init_posts_query |> Repo.get!(id) |> PostView.from_post(current_user)}
  end

  # transform resource (from subscription trigger) for current user
  def resource_for_user(%Post{id: id}, _, %{context: %{current_user: current_user}}) do
    {:ok, Post |> init_posts_query |> Repo.get!(id) |> PostView.from_post(current_user)}
  end

  def resource_for_user(%PostView{id: id}, args, context) do
    resource_for_user(%Post{id: id}, args, context)
  end

  def list_thread_posts(%{id: thread_id}, arguments, %{context: %{current_user: current_user}}) do
    cursor = arguments
             |> case do
               %{cursor: cursor} -> cursor
               _ -> %{}
             end

    %{entries: posts, metadata: metadata} = Post
    |> init_posts_query(reverse_order: true)
    |> where([p], p.parent_id == ^thread_id)
    |> Repo.paginate(cursor_fields: [:inserted_at, :id], sort_direction: :asc, limit: cursor[:limit] || 50, before: cursor[:before], after: cursor[:after])

    IO.inspect("list_thread_posts")
    IO.inspect(cursor)

    posts_with_voting_scores = PostView.from_posts(posts, current_user)

    {:ok, Openjodel.PaginatedPosts.from_pagination(posts_with_voting_scores, metadata)}
  end

  def vote_post(_parent, %{id: id, score: score}, %{context: %{current_user: current_user}}) do
    Processes.Thread.vote_post(current_user, %{post_id: id, score: score})
    |> case do
      {:ok, voting} = result -> 
        post = Post |> init_posts_query |> Repo.get!(id)
        Streams.Server.publish_post_change(post)
        result
      {:error, _} -> throw("Unable to vote post (TODO: add proper error handling)")
    end

    {
      :ok, 
      Post |> init_posts_query |> Repo.get!(id) |> PostView.from_post(current_user)
    }
  end


  def init_posts_query(queryable, opts \\ []) do
    order_by = case opts[:reverse_order] do
      true -> [asc: :inserted_at, asc: :id]
      _ -> [desc: :inserted_at, desc: :id]
    end

  
    queryable |> from(preload: [votings: [], participant: []], order_by: ^order_by)
  end


  # TODO: participant not fetched everytime
end
