defmodule OpenjodelWeb.Streams.Server do
  use GenServer
  alias Openjodel.Post
  alias OpenjodelWeb.Endpoint

  # Client
  def start_link do
    state = {}
    GenServer.start_link(__MODULE__, state, name: __MODULE__)
  end

  def attach_thread(%Post{} = thread) do
    GenServer.cast(__MODULE__, {:attach_thread, thread})
  end

  def publish_post_change(%Post{} = thread) do
    GenServer.cast(__MODULE__, {:publish_post_change, thread})
  end

  # Server callbacks
  @impl true
  def init(state) do
    {:ok, state}
  end

  @impl true
  def handle_cast({:attach_thread, thread}, state) do
    _attach_thread(thread)
    {:noreply, state}
  end

  @impl true
  def handle_cast({:publish_post_change, post}, state) do
    _publish_post_change(post)
    {:noreply, state}
  end

  defp _attach_thread(%Post{id: id} = thread) do
    max_distance = 500

    sql = "insert into stream_posts(stream_id, post_id, inserted_at) select streams.id, posts.id, posts.inserted_at from streams, posts where posts.id=$1 AND ST_DWithin(posts.geog, streams.geog, $2) returning *"
    params = [id, max_distance]

    result = Ecto.Adapters.SQL.query!(Openjodel.Repo, sql, params)
    updated_stream_ids = result.rows
    |> Enum.map(&Enum.zip(result.columns, &1))
    |> Enum.map(&Enum.into(&1, %{}))
    |> Enum.map(&Map.fetch!(&1, "stream_id"))

    updated_stream_ids 
    |> Enum.each(&Absinthe.Subscription.publish(Endpoint, thread, stream_thread_added: &1))

  end

  defp _publish_post_change(%Post{id: id, parent_id: nil} = thread) do
    IO.inspect("__publish_post_change")
    # publish change for thread post himself
    Absinthe.Subscription.publish(Endpoint, thread, thread_post_changes: id)

    # lookup in which streams thread is attached to

    %{rows: rows}= Ecto.Adapters.SQL.query!(Openjodel.Repo, "select stream_id from stream_posts where post_id = $1", [id])
  
    updated_stream_ids = rows
                         |> Enum.map(&Enum.at(&1, 0)) 

    # let schema handle non-thread case!!

    # only call if post is thread!!
    updated_stream_ids 
    |> IO.inspect
    |> Enum.each(&Absinthe.Subscription.publish(Endpoint, thread, stream_thread_changed: &1))


  end

  defp _publish_post_change(%Post{parent_id: thread_id} = post) do
    IO.inspect("__publish_post_change (for actual posts!)")
    Absinthe.Subscription.publish(Endpoint, post, thread_post_changes: thread_id)
  end
end
