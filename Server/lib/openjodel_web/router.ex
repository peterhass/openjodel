defmodule OpenjodelWeb.Router do
  use OpenjodelWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug OpenjodelWeb.ContextPlug
  end

  scope "/", OpenjodelWeb do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end

  scope "/api" do
    pipe_through :api

    forward "/graphiql", Absinthe.Plug.GraphiQL, schema: OpenjodelWeb.Schema, socket: OpenjodelWeb.UserSocket
    forward "/", Absinthe.Plug, schema: OpenjodelWeb.Schema
  end

  # Other scopes may use custom stacks.
  # scope "/api", OpenjodelWeb do
  #   pipe_through :api
  # end
end