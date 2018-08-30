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
    |> cast(attrs, [:post_id, :user_id, :name])
    |> foreign_key_constraint(:post_id)
    |> foreign_key_constraint(:user_id)
    |> validate_required([:name, :post_id, :user_id])
    |> unique_constraint(:name_in_thread_taken, name: :participants_post_id_name_index)
    |> unique_constraint(:user_in_thread_exists, name: :participants_post_id_user_id_index)
  end
end
