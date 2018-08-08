defmodule OpenjodelWeb.PostsHelper do

  alias Openjodel.{Repo, Post, Voting}
  

  def init_voting_form do
    %{
      upvote_changeset: Voting.positive_voting |> Voting.changeset(%{}),
      downvote_changeset: Voting.negative_voting |> Voting.changeset(%{})
    }
  end
end
