defmodule Openjodel.Stream do
  use Ecto.Schema

  schema "streams" do
    field :inserted_at, :utc_datetime
  end
end
