defmodule OpenjodelWeb.VotingController do
  use OpenjodelWeb, :controller
  alias Openjodel.{Post, Repo, Voting}
  import Ecto.Query

  def create(conn, %{"voting" => voting_params} = params) do
    post_id = post_id(params)

    %Voting{inserted_at: Calendar.DateTime.now_utc, post_id: post_id}
    |> Voting.changeset(voting_params)
    |> Repo.insert
    |> case do
      {:ok, voting} ->
        conn
        |> put_flash(:info, "Voting created!")
        |> redirect(to: parent_resource_path(conn, params))
    end
  end

  defp parent_resource_path(conn, %{"thread_id" => thread_id, "posts_id" => _post_id}) do
    thread_posts_path(conn, :index, thread_id)
  end

  defp parent_resource_path(conn, %{"thread_id" => _thread_id}) do
    thread_path(conn, :index)
  end

  defp post_id(%{"thread_id" => _thread_id, "posts_id" => post_id}) do
    post_id(post_id)
  end

  defp post_id(%{"thread_id" => thread_id}) do
    post_id(thread_id)
  end

  defp post_id(id) when is_binary(id) do
    {int_id, ""} = Integer.parse(id)

    int_id
  end

  defp post_id(id) do
    id
  end
end
