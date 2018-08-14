defmodule OpenjodelWeb.Schema do
  use Absinthe.Schema

  import_types Absinthe.Type.Custom
  import_types OpenjodelWeb.Schema.ContentTypes

  alias OpenjodelWeb.Resolvers

  object :validate_token_parameter do
    field :token, :string
  end

  mutation do
    field :login, :validate_token_parameter do
      arg :token, non_null(:string)

      resolve &Resolvers.Content.login/3
    end
    
    field :signup, :validate_token_parameter do
      resolve &Resolvers.Content.signup/3
    end
  end

  query do
    @desc "Get all posts"
    field :posts, list_of(:post) do
      resolve &Resolvers.Content.list_posts/3
    end

    @desc "Get a thread post"
    field :thread, :post do
      arg :id, non_null(:id)
      resolve &Resolvers.Content.find_thread/3
    end

    @desc "Get all thread posts"
    field :threads, list_of(:post) do
      resolve &Resolvers.Content.list_threads/3
    end
  end
end
