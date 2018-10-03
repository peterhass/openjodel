defmodule OpenjodelWeb.Router do
  use OpenjodelWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug OpenjodelWeb.ContextPlug
  end

  scope "/api" do
    pipe_through :api

    forward "/graphiql", Absinthe.Plug.GraphiQL, schema: OpenjodelWeb.Schema, socket: OpenjodelWeb.UserSocket
    forward "/", Absinthe.Plug, schema: OpenjodelWeb.Schema
  end

end
