defmodule Openjodel.Voting do
  use Ecto.Schema
  import Ecto.Changeset
  alias Openjodel.{Voting, Post, User}
  
  schema "votings" do
    field :score, :integer
    field :inserted_at, :utc_datetime
    # TODO: add user who voted when available

    belongs_to :post, Post
    belongs_to :user, User
  end

  def positive_voting(%Voting{} = voting \\ %Voting{}) do
    %Voting{voting | score: 1}
  end

  def negative_voting(%Voting{} = voting \\ %Voting{}) do
    %Voting{voting | score: -1}
  end

  def changeset(%Voting{} = voting, attrs) do
    voting
    |> cast(attrs, [:score, :user_id, :post_id])
    |> validate_inclusion(:score, [-1, 1, 0])
    |> validate_required(:score)
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:post_id)
    |> validate_required([:score, :user_id, :post_id])
    |> unique_constraint(:user_post_voting_exists, name: :votings_post_id_user_id_index)
  end
end
