defmodule OpenjodelWeb.PostsController do
  use OpenjodelWeb, :controller
  alias Openjodel.{Repo, Post, Voting}
  alias OpenjodelWeb.{PostsHelper}
  import Ecto.Query

  def index(conn, %{"thread_id" => thread_id} = _params) do
    posts = Post |> Post.from_parent(thread_id) |> from(preload: [:votings]) |> Repo.all
    thread = Post |> from(preload: [:votings]) |> Repo.get!(thread_id)

    render conn, "index.html", 
      posts: posts, 
      thread_id: thread_id, 
      thread: thread,
      voting_form: PostsHelper.init_voting_form
  end

  def new(conn, %{"thread_id" => thread_id} = _params) do
    changeset = Post.changeset(%Post{}, %{})
    thread = Repo.get!(Post, thread_id)

    render conn, "new.html", changeset: changeset, thread_id: thread_id, thread: thread
  end

  def create(conn, %{"post" => post_params, "thread_id" => thread_id}) do
    {thread_id, ""} = Integer.parse(thread_id)
    thread = Repo.get!(Post, thread_id)

    %Post{inserted_at: Calendar.DateTime.now_utc, parent_id: thread_id}
    |> Post.changeset(post_params)
    |> Repo.insert()
    |> IO.inspect()
    |> case do
      {:ok, post} ->
        conn
        |> put_flash(:info, "Post created!")
        |> redirect(to: thread_posts_path(conn, :index, thread_id))
      
      {:error, %Ecto.Changeset{} = changeset} ->
        render conn, "new.html", changeset: changeset, thread_id: thread_id, thread: thread
    end
  end

  def delete(conn, %{"id" => id, "thread_id" => thread_id} = _params) do
    Repo.get!(Post, id)
    |> Repo.delete()
    |> case do
      {:ok, _room} ->
        conn
        |> put_flash(:info, "Post deleted!")
        |> redirect(to: thread_posts_path(conn, :index, thread_id))
    end
  end

end

