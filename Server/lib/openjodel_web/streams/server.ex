defmodule OpenjodelWeb.Streams.Server do
  use GenServer
  alias Openjodel.Post
  alias OpenjodelWeb.Endpoint
  alias Openjodel.Processes


  defmodule ServerImpl do
    def attach_thread(%Post{} = thread) do
      Processes.Streams.add_post_to_streams(thread)
      |> Enum.each(&Absinthe.Subscription.publish(Endpoint, thread, stream_thread_added: &1))
    end

    def publish_post_change(%Post{id: id, parent_id: nil} = thread) do
      Absinthe.Subscription.publish(Endpoint, thread, thread_post_changes: id)

      Processes.Streams.streams_containing_post(thread)
      |> Enum.each(&Absinthe.Subscription.publish(Endpoint, thread, stream_thread_changed: &1))
    end

    def publish_post_change(%Post{parent_id: thread_id} = post) do
      Absinthe.Subscription.publish(Endpoint, post, thread_post_changes: thread_id)
    end
  end

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
    ServerImpl.attach_thread(thread)
    {:noreply, state}
  end

  @impl true
  def handle_cast({:publish_post_change, post}, state) do
    ServerImpl.publish_post_change(post)
    {:noreply, state}
  end

end
