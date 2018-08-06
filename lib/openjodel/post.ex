defmodule Openjodel.Post do
  use Ecto.Schema
  import Ecto.Changeset
  alias Openjodel.Post

  schema "posts" do
    field :message, :string
    field :inserted_at, :utc_datetime

    has_many :children, Post, foreign_key: :parent_id
    belongs_to :parent, Post
  end

  def changeset(%Post{} = post, attrs) do
    post 
    |> cast(attrs, [:message, :inserted_at])
    |> validate_required([:message, :inserted_at])
  end


  def parents(query) do
    import Ecto.Query
    from p in query, where: is_nil(p.parent_id)
  end

  
end
