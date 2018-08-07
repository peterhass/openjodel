defmodule OpenjodelWeb.ThreadController do
  use OpenjodelWeb, :controller
  alias Openjodel.{Repo, Post, Voting}
  import Ecto.Query

  def index(conn, _params) do
    threads = Post |> Post.parents |> from(preload: [:children, :votings]) |> Repo.all

    upvote_changeset = Voting.positive_voting |> Voting.changeset(%{})
    downvote_changeset = Voting.negative_voting |> Voting.changeset(%{})

    render conn, "index.html", 
      threads: threads, 
      downvote_changeset: downvote_changeset,
      upvote_changeset: upvote_changeset
  end

  def new(conn, params) do
    changeset = Post.changeset(%Post{}, %{})

    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"post" => post_params}) do
    %Post{inserted_at: Calendar.DateTime.now_utc}
    |> Post.changeset(Map.merge(post_params, %{"parent_id" => nil}))
    |> Repo.insert()
    |> IO.inspect()
    |> case do
      {:ok, post} ->
        conn
        |> put_flash(:info, "Thread created!")
        |> redirect(to: thread_path(conn, :index))
      
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
        |> put_flash(:info, "Thread deleted!")
        |> redirect(to: thread_path(conn, :index))
    end
  end

end


