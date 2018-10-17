defmodule OpenjodelWeb.Schema do
  use Absinthe.Schema

  import_types Absinthe.Type.Custom
  import_types Absinthe.Plug.Types
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

    field :thread_post_changes, :post do
      arg :thread_id, non_null(:id)

      config fn args, _ ->
        {:ok, topic: args.thread_id}
      end
      
      resolve &Resolvers.Content.resource_for_user/3

    end

    field :stream_thread_added, :post do
      arg :stream_id, non_null(:id)
      
      config fn args, _ ->
        {:ok, topic: args.stream_id}
      end
    end

    field :stream_thread_changed, :post do
      arg :stream_id, non_null(:id)

      config fn args, _ ->
        {:ok, topic: args.stream_id}
      end

      resolve &Resolvers.Content.resource_for_user/3
    end

    field :post_added, :post do
      arg :thread_id, non_null(:id)

      config fn args, _ ->
        {:ok, topic: args.thread_id}
      end

      trigger :create_post, topic: fn post -> post.parent_id end
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
      arg :message, :string
      arg :image, :upload
      arg :geog, list_of(:float)

      resolve &Resolvers.Content.create_thread/3
    end

    field :create_post, :post do
      arg :message, :string
      arg :image, :upload
      arg :parent_id, non_null(:id)

      resolve &Resolvers.Content.create_post/3
    end
  end

  query do
    @desc "Get a thread with children"
    field :thread, :post do
      arg :id, non_null(:id)

      resolve &Resolvers.Content.find_thread/3
    end

    @desc "Get all threads"
    field :threads, :paginated_posts do
      arg :stream_id, :id
      arg :cursor, :cursor_input
    
      resolve &Resolvers.Content.list_threads/3
    end
  end
end
