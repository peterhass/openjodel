defmodule OpenjodelWeb.Schema.ContentTypes do
  use Absinthe.Schema.Notation

  alias OpenjodelWeb.Resolvers

  object :participant do
    field :name, :string
  end

  object :post do
    field :id, :id
    field :parent_id, :id
    field :message, :string
    field :inserted_at, :datetime
    field :voting_score, :integer
    field :image_url, :string
    field :current_user_voting_score, :integer
    field :participant, :participant
    # TODO: think about performance
    field :children, :paginated_posts do
      arg :cursor, :cursor_input
      resolve &Resolvers.Content.list_thread_posts/3
    end
  end

  input_object :cursor_input do
    field :before, :string
    field :after, :string
    field :limit, :integer
  end

  object :cursor do
    field :before, :string
    field :after, :string
  end

  object :paginated_posts do
    field :posts, list_of(:post)
    field :cursor, :cursor
  end
end
