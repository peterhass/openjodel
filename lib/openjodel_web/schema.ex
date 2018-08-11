defmodule OpenjodelWeb.Schema do
  use Absinthe.Schema

  import_types Absinthe.Type.Custom
  import_types OpenjodelWeb.Schema.ContentTypes

  alias OpenjodelWeb.Resolvers
  

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
