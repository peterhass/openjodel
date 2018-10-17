defmodule Openjodel.StreamPost do
  use Ecto.Schema
  alias Openjodel.{Stream, Post}

  schema "stream_posts" do
    field :inserted_at, :utc_datetime
    belongs_to :stream, Stream
    belongs_to :post, Post
  end
end
