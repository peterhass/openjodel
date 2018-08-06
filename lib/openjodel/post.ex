defmodule Openjodel.Post do
  use Ecto.Schema
  import Ecto.Changeset
  alias Openjodel.Post

  schema "posts" do
    field :message, :string
    field :inserted_at, :utc_datetime
  end

  def changeset(%Post{} = post, attrs) do
    post 
    |> cast(attrs, [:message, :inserted_at])
    |> validate_required([:message, :inserted_at])
  end
  
end
