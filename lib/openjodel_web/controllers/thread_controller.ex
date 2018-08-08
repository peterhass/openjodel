defmodule OpenjodelWeb.ThreadController do
  use OpenjodelWeb, :controller
  alias OpenjodelWeb.{PostsHelper}
  alias Openjodel.{Repo, Post, Voting}
  import Ecto.Query

  def index(conn, _params) do
    threads = Post |> Post.parents |> PostsHelper.prepare_posts_for_listing |> Repo.all

    render conn, "index.html", 
      threads: threads, 
      voting_form: PostsHelper.init_voting_form
  end

  def new(conn, params) do
    changeset = Post.changeset(%Post{}, %{})

    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"post" => post_params}) do
    %Post{}
    |> Post.post_to_insert_now
    |> Post.changeset(post_params)
    |> Repo.insert()
    |> case do
      {:ok, post} ->
        conn
        |> put_flash(:info, "Thread created!")
        |> redirect(to: thread_path(conn, :index))
      
      {:error, %Ecto.Changeset{} = changeset} ->
        render conn, "new.html", changeset: changeset
    end
  end

  def delete(conn, %{"id" => id}) do
    Repo.get!(Post, id)
    |> Repo.delete()
    |> case do
      {:ok, _room} ->
        conn
        |> put_flash(:info, "Thread deleted!")
        |> redirect(to: thread_path(conn, :index))
    end
  end

 end


