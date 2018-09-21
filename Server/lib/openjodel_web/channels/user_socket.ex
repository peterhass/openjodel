defmodule OpenjodelWeb.UserSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: OpenjodelWeb.Schema
  alias OpenjodelWeb.TokenAuthentication

  ## Channels
  # channel "room:*", OpenjodelWeb.RoomChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket
  # transport :longpoll, Phoenix.Transports.LongPoll

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(%{"token" => token}, socket) do

    # current_user = current_user(_params)
    case TokenAuthentication.authorize(token) do
      {:ok, user} -> 
        socket = Absinthe.Phoenix.Socket.put_options(socket, context: %{
          current_user: user
        })
        {:ok, socket}
      {:error, _reason} -> :error
    end
  end

  def connect(_params, _socket), do: :error

  #defp current_user(%{"user_id" => id}) do
  #  MyApp.Repo.get(User, id)
  #end


  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     OpenjodelWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(socket) do
    #require IEx; IEx.pry
    user_id = socket.assigns.absinthe.opts[:context].current_user.id
    "user_socket:#{user_id}"
  end
end
