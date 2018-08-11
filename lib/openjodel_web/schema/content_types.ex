defmodule OpenjodelWeb.Schema.ContentTypes do
  use Absinthe.Schema.Notation

  object :post do
    field :id, :id
    field :parent_id, :id
    field :message, :string
    field :inserted_at, :datetime
  end
end
