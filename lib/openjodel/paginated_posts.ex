defmodule Openjodel.PaginatedPosts do
  defstruct [:posts, :cursor]

  def from_pagination(posts, metadata) do
    %__MODULE__{
      posts: posts,
      cursor: %{
        before: metadata.before,
        after: metadata.after
      }
    }
  end
end
