defmodule OpenjodelWeb.PageController do
  use OpenjodelWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
