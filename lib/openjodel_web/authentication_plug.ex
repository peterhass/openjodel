defmodule OpenjodelWeb.AuthenticationPlug do
  @behaviour Plug

  import Plug.Conn

  alias Openjodel.{Repo, User}

  def init(opts), do: opts

  def call(conn, _) do
    context = build_user_context(conn)
    Absinthe.Plug.put_options(conn, user_context: context)
  end

  @doc """
  Return the current user context based on the authorization header
  """
  def build_user_context(conn) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
         {:ok, current_user} <- authorize(token) do
      %{current_user: current_user}
    else
      _ -> %{}
    end
  end


  def authorize("123" = token) do
    %User{id: 999}
  end

  def authorize(token) do
    {:error, "invalid auth token"}
  end

end

