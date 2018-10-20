defmodule Openjodel.Stream do
  use Ecto.Schema

  schema "streams" do
    field :inserted_at, :utc_datetime
    field :name, :string
  end
end
