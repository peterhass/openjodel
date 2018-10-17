defmodule Openjodel.Posts.VotePost do
  alias Openjodel.{Repo, User, Voting}
  import Ecto.Query

  def vote(%User{id: user_id}, %{post_id: post_id, score: score}) do
    # ensure voting record exists for locking to work
    %Voting{inserted_at: Calendar.DateTime.now_utc()}
    |> Voting.changeset(%{user_id: user_id, post_id: post_id, score: 0})
    |> Repo.insert!(on_conflict: :nothing)

    # update voting
    Voting
    |> lock("FOR UPDATE")
    |> Repo.get_by(user_id: user_id, post_id: post_id)
    |> case do
      nil -> %Voting{}
      voting -> voting
    end
    |> Map.put(:inserted_at, Calendar.DateTime.now_utc())
    |> Voting.changeset(%{user_id: user_id, post_id: post_id, score: safe_voting_score(score)})
    |> Repo.insert_or_update()
  end

  defp safe_voting_score(score) when score > 0, do: 1
  defp safe_voting_score(score) when score < 0, do: -1
  defp safe_voting_score(_score), do: 0
end
