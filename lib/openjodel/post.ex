defmodule Openjodel.Post do
  use Ecto.Schema
  import Ecto.Changeset
  alias Openjodel.{Post, Voting}

  schema "posts" do
    field :message, :string
    field :inserted_at, :utc_datetime

    has_many :children, Post, foreign_key: :parent_id
    belongs_to :parent, Post
    has_many :votings, Voting
  end

  def changeset(%Post{} = post, attrs) do
    post 
    |> cast(attrs, [:message, :inserted_at])
    |> validate_required([:message, :inserted_at])
  end

  def post_to_insert_now(%Post{} = post \\ %Post{}) do
    %{post | inserted_at: Calendar.DateTime.now_utc}
  end


  def parents(query) do
    import Ecto.Query
    from p in query, where: is_nil(p.parent_id)
  end

  def from_parent(query, parent_id) do
    import Ecto.Query
    from p in query, where: p.parent_id == ^parent_id
  end


  
end
