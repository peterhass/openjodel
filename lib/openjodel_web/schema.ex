defmodule OpenjodelWeb.Schema do
  use Absinthe.Schema

  import_types Absinthe.Type.Custom
  import_types OpenjodelWeb.Schema.ContentTypes

  alias OpenjodelWeb.Resolvers

  object :validate_token_parameter do
    field :token, :string
  end

  object :vote_post_parameter do
    field :id, :integer
    field :score, :integer
  end

  subscription do
    field :thread_changed, :post do
      arg :post_id, non_null(:id)

      config fn args, _ ->
        {:ok, topic: args.post_id}
      end

      trigger :vote_post, topic: fn post ->
        post.parent_id || post.id
      end

      trigger :create_post, topic: fn post ->
        post.parent_id
      end

      resolve fn parent, args, res ->
        Resolvers.Content.find_thread(parent, %{id: args.post_id}, res)
      end
    end

    field :threads_changed, list_of(:post) do
      config fn args, _ ->
        {:ok, topic: :is_thread}
      end

      trigger :vote_post, topic: fn post ->
        case post.parent_id do
          nil -> :is_thread
          _ -> :is_post 
        end
      end

      trigger :create_thread, topic: fn _ -> :is_thread end 

      resolve &Resolvers.Content.list_threads/3
    end
  end

  mutation do
    field :login, :validate_token_parameter do
      arg :token, non_null(:string)

      resolve &Resolvers.Content.login/3
    end
    
    field :signup, :validate_token_parameter do
      resolve &Resolvers.Content.signup/3
    end

    field :vote_post, :post do
      arg :id, non_null(:id)
      arg :score, non_null(:integer)

      resolve &Resolvers.Content.vote_post/3
    end

    field :create_thread, :post do
      arg :message, non_null(:string)

      resolve &Resolvers.Content.create_thread/3
    end

    field :create_post, :post do
      arg :message, non_null(:string)
      arg :parent_id, non_null(:id)

      resolve &Resolvers.Content.create_post/3
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
