defmodule OpenjodelWeb.PostsController do
  use OpenjodelWeb, :controller
  alias Openjodel.{Repo, Post, Voting}
  alias OpenjodelWeb.{PostsHelper}
  import Ecto.Query

  def index(conn, %{"thread_id" => thread_id}) do
    thread = Post |> PostsHelper.prepare_posts_for_listing |> Repo.get!(thread_id)

    posts = thread.children

    render conn, "index.html", 
      posts: posts, 
      thread_id: thread_id, 
      thread: thread,
      voting_form: PostsHelper.init_voting_form
  end

  def new(conn, %{"thread_id" => thread_id}) do
    changeset = Post.changeset(%Post{}, %{})
    thread = fetch_post(thread_id)

    render conn, "new.html", changeset: changeset, thread_id: thread_id, thread: thread
  end

  def create(conn, %{"post" => post_params, "thread_id" => thread_id}) do
    thread = fetch_post(thread_id)

    %Post{parent_id: thread.id}
    |> Post.post_to_insert_now
    |> Post.changeset(post_params)
    |> Repo.insert()
    |> case do
      {:ok, post} ->
        conn
        |> put_flash(:info, "Post created!")
        |> redirect(to: thread_posts_path(conn, :index, thread_id))
      
      {:error, %Ecto.Changeset{} = changeset} ->
        render conn, "new.html", changeset: changeset, thread_id: thread_id, thread: thread
    end
  end

  def delete(conn, %{"id" => id, "thread_id" => thread_id}) do
    fetch_post(id)
    |> Repo.delete()
    |> case do
      {:ok, _room} ->
        conn
        |> put_flash(:info, "Post deleted!")
        |> redirect(to: thread_posts_path(conn, :index, thread_id))
    end
  end

  defp fetch_post(id) when is_binary(id) do
    {id, ""} = Integer.parse(id)
    fetch_post(id)
  end

  defp fetch_post(id) do
    Repo.get!(Post, id)
  end

end

