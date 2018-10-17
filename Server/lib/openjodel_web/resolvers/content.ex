defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{
    Post,
    Users,
    Posts,
    PaginatedPosts,
    Processes,
    Streams
  }

  alias OpenjodelWeb.Streams.Server, as: StreamsServer

  alias OpenjodelWeb.PostView

  def signup(_, _, _) do
    {:ok, Users.signup()}
  end

  def login(_, %{token: token}, _) do
    Users.Query.find_by(token)
    |> case do
      nil -> {:error, "cannot find user for token"}
      user -> {:ok, user}
    end
  end

  defp convert_post_attrs(post_attrs) do
    Map.merge(post_attrs, %{
      geog: %{
        "coordinates" => post_attrs.geog,
        "type" => "Point",
        "srid" => 4326
      }
    })
  end

  def create_thread(_, post_attrs, %{context: %{current_user: current_user}}) do
    Posts.StartThread.start(current_user, convert_post_attrs(post_attrs))
    |> case do
      {:ok, thread} ->
        StreamsServer.attach_thread(thread)
        {:ok, thread}

      {:error, e} ->
        throw(e)
    end
  end

  def create_post(_, post_attrs, %{context: %{current_user: current_user}}) do
    Posts.AddPost.add(current_user, convert_post_attrs(post_attrs))
    |> case do
      {:ok, post} -> {:ok, post}
      {:error, e} -> throw(e)
    end
  end

  def find_stream(_, %{id: id}, %{context: %{current_user: _current_user}}) do
    Streams.Query.find(id)
    |> case do
      nil -> {:error, "unable to find stream"}
      stream -> {:ok, stream}
    end
  end

  def find_thread(_parent, %{id: id}, %{context: %{current_user: current_user}}) do
    Posts.Query.find(id)
    |> case do
      nil -> {:error, "Unable to find thread"}
      thread -> {:ok, PostView.from_post(thread, current_user)}
    end
  end

  def list_threads(%{id: stream_id}, arguments, %{context: %{current_user: current_user}}) do
    input_cursor =
      arguments
      |> case do
        %{cursor: cursor} -> cursor
        _ -> %{}
      end

    %PaginatedPosts{posts: posts, cursor: cursor} =
      Posts.Query.paginated_for_stream(stream_id, input_cursor)

    paginated_threads = %PaginatedPosts{
      posts: PostView.from_posts(posts, current_user),
      cursor: cursor
    }

    {:ok, paginated_threads}
  end

  def resource_for_user(%Post{id: id}, _, %{context: %{current_user: current_user}}) do
    Posts.Query.find(id)
    |> case do
      nil -> {:error, "Unable to find post"}
      post -> {:ok, PostView.from_post(post, current_user)}
    end
  end

  def resource_for_user(%PostView{id: id}, args, context) do
    resource_for_user(%Post{id: id}, args, context)
  end

  def list_thread_posts(%{id: thread_id}, arguments, %{context: %{current_user: current_user}}) do
    input_cursor =
      arguments
      |> case do
        %{cursor: cursor} -> cursor
        _ -> %{}
      end

    %PaginatedPosts{posts: posts, cursor: cursor} =
      Posts.Query.paginated_for_thread(thread_id, input_cursor)

    paginated_posts = %PaginatedPosts{
      posts: PostView.from_posts(posts, current_user),
      cursor: cursor
    }

    {:ok, paginated_posts}
  end

  def vote_post(_parent, %{id: id, score: score}, %{context: %{current_user: current_user}}) do
    Posts.VotePost.vote(current_user, %{post_id: id, score: score})
    |> case do
      {:ok, _voting} = result ->
        Posts.Query.find(id)
        |> StreamsServer.publish_post_change()

        result

      {:error, _} ->
        throw("Unable to vote post (TODO: add proper error handling)")
    end

    {
      :ok,
      Posts.Query.find(id) |> PostView.from_post(current_user)
    }
  end
end
