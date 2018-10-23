defmodule Openjodel.Stream do
  use Ecto.Schema
  import Ecto.Changeset

  schema "streams" do
    field :inserted_at, :utc_datetime
    field :name, :string
    field :geog, Geo.PostGIS.Geometry
  end

  def changeset(%__MODULE__{} = stream, attrs) do
    stream 
    |> cast(attrs, [:name, :inserted_at, :geog])
    |> validate_required([:name, :inserted_at, :geog])
  end

  def stream_to_insert_now(%__MODULE__{} = stream \\ %__MODULE__{}) do
    %{stream | inserted_at: Calendar.DateTime.now_utc}
  end
end
