defmodule Openjodel.Voting do
  use Ecto.Schema
  import Ecto.Changeset
  alias Openjodel.{Voting, Post}
  
  schema "votings" do
    field :score, :integer
    field :inserted_at, :utc_datetime
    # TODO: add user who voted when available

    belongs_to :post, Post
  end

  def positive_voting(%Voting{} = voting \\ %Voting{}) do
    %Voting{voting | score: 1}
  end

  def negative_voting(%Voting{} = voting \\ %Voting{}) do
    %Voting{voting | score: -1}
  end

  def changeset(%Voting{} = voting, attrs) do
    voting
    |> cast(attrs, [:score])
    |> validate_inclusion(:score, [-1, 1])
    |> validate_required(:score)
  end

end
