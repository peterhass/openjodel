defmodule OpenjodelWeb.Schema.ContentTypes do
  use Absinthe.Schema.Notation

  alias OpenjodelWeb.Resolvers

  object :post do
    field :id, :id
    field :parent_id, :id
    field :message, :string
    field :inserted_at, :datetime
    field :voting_score, :integer
    field :current_user_voting_score, :integer
    # TODO: think about performance
    field :children, list_of(:post) do
      resolve &Resolvers.Content.list_thread_posts/3
    end
  end
end
