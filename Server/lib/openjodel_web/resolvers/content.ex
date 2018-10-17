defmodule OpenjodelWeb.Resolvers.Content do
  alias Openjodel.{
    Post, 
    PaginatedPosts, 
    Processes
  }

  alias Openjodel.Streams.Query, as: StreamsQuery
  alias OpenjodelWeb.Streams.Server, as: StreamsServer

  alias Openjodel.Processes
  alias OpenjodelWeb.PostView

  def signup(_, _, _) do
    {:ok, Processes.Users.signup}
  end

  def login(_, %{token: token}, _) do
    Processes.Users.find_user_by_token(token)
    |> case do
      nil -> {:error, "cannot find user for token"}
      user -> {:ok, user}
    end
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
        StreamsServer.attach_thread(thread)
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

  def find_stream(_, %{id: id}, %{context: %{current_user: _current_user}}) do
    StreamsQuery.find(id)
    |> case do
      nil -> {:error, "unable to find stream"}
      stream -> {:ok, stream}
    end
  end

  def find_thread(_parent, %{id: id}, %{context: %{current_user: current_user}}) do
    Processes.Thread.find_thread(id)
    |> case do
      nil -> {:error, "Unable to find thread"}
      thread -> {:ok, PostView.from_post(thread, current_user)}
    end
  end

  def list_threads(%{id: stream_id}, arguments, %{context: %{current_user: current_user}}) do
    input_cursor = arguments
             |> case do
               %{cursor: cursor} -> cursor
               _ -> %{}
             end

    %PaginatedPosts{posts: posts, cursor: cursor} = Processes.Thread.paginated_threads_in_stream(stream_id, input_cursor)
    paginated_threads = %PaginatedPosts{posts: PostView.from_posts(posts, current_user), cursor: cursor}

    {:ok, paginated_threads}
  end

  # transform resource (from subscription trigger) for current user
  def resource_for_user(%Post{id: id}, _, %{context: %{current_user: current_user}}) do
    Processes.Thread.find_post(id)
    |> case do
      {:ok, post} -> {:ok, PostView.from_post(post, current_user)}
      other_result -> other_result
    end
  end

  def resource_for_user(%PostView{id: id}, args, context) do
    resource_for_user(%Post{id: id}, args, context)
  end

  def list_thread_posts(%{id: thread_id}, arguments, %{context: %{current_user: current_user}}) do
    input_cursor = arguments
             |> case do
               %{cursor: cursor} -> cursor
               _ -> %{}
             end

    %PaginatedPosts{posts: posts, cursor: cursor} = Processes.Thread.paginated_posts_in_thread(thread_id, input_cursor)
    paginated_posts = %PaginatedPosts{posts: PostView.from_posts(posts, current_user), cursor: cursor}

    {:ok, paginated_posts}
  end

  def vote_post(_parent, %{id: id, score: score}, %{context: %{current_user: current_user}}) do
    Processes.Thread.vote_post(current_user, %{post_id: id, score: score})
    |> case do
      {:ok, _voting} = result -> 
        Processes.Thread.find_post(id)
        |> StreamsServer.publish_post_change
        
        result
      {:error, _} -> throw("Unable to vote post (TODO: add proper error handling)")
    end

    {
      :ok, 
      Processes.Thread.find_post(id) |> PostView.from_post(current_user)
    }
  end
end
