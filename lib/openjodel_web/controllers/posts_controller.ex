defmodule OpenjodelWeb.PostsController do
  use OpenjodelWeb, :controller
  alias Openjodel.{Repo, Post}
  import Ecto.Query

  def index(conn, _params) do
    posts = Repo.all(from Post)

    render conn, "index.html", posts: posts
  end

  def new(conn, params) do
    changeset = Post.changeset(%Post{}, %{})

    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"post" => post_params}) do
    %Post{inserted_at: Calendar.DateTime.now_utc}
    |> Post.changeset(post_params)
    |> Repo.insert()
    |> IO.inspect()
    |> case do
      {:ok, post} ->
        conn
        |> put_flash(:info, "Post created!")
        |> redirect(to: posts_path(conn, :index))
      
      {:error, %Ecto.Changeset{} = changeset} ->
        render conn, "new.html", changeset: changeset
    end
  end

  def delete(conn, %{"id" => id} = _params) do
    Repo.get!(Post, id)
    |> Repo.delete()
    |> case do
      {:ok, _room} ->
        conn
        |> put_flash(:info, "Post deleted!")
        |> redirect(to: posts_path(conn, :index))
    end
  end

end

