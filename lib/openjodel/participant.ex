defmodule Openjodel.Participant do
  use Ecto.Schema
  import Ecto.Changeset

  alias Openjodel.{User, Post, Participant}

  schema "participants" do
    field :name, :string

    # thread
    belongs_to :post, Post

    # real user
    belongs_to :user, User

    # all posts of participant in thread
    has_many :posts, Post
  end

  def changeset(%Participant{} = participant, attrs) do
    participant
    |> cast(attrs, [:name])
    |> foreign_key_constraint(:post_id)
    |> foreign_key_constraint(:user_id)
    |> validate_required([:name])
  end
end
