defmodule OpenjodelWeb.PostsHelper do

  import Ecto.Query
  alias Openjodel.{Repo, Post, Voting}

  def prepare_posts_for_listing(queryable) do
    queryable |> from(preload: [children: [:votings], votings: []])
  end

  def init_voting_form do
    %{
      upvote_changeset: Voting.positive_voting |> Voting.changeset(%{}),
      downvote_changeset: Voting.negative_voting |> Voting.changeset(%{})
    }
  end
end
