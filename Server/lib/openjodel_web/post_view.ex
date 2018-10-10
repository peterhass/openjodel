defmodule OpenjodelWeb.PostView do
  alias Openjodel.{Post, User}

  defstruct [:id, 
             :inserted_at, 
             :message, 
             :parent_id, 
             :participant, 
             :voting_score, 
             :current_user_voting_score,
             :image_url 
  ]

  def from_posts(posts, %User{} = user \\ nil) when is_list(posts) do
    posts |> Enum.map(&(from_post(&1, user)))
  end
  
  def from_post(%Post{votings: votings} = post, %User{id: current_user_id}) when is_list(votings) do
    %__MODULE__{from_post(post) | current_user_voting_score: user_voting_score(votings, current_user_id)}
  end

  def from_post(%Post{votings: votings} = post) when is_list(votings) do
    %__MODULE__{
      id: post.id, 
      inserted_at: post.inserted_at, 
      message: post.message, 
      participant: post.participant, 
      parent_id: post.parent_id, 
      voting_score: calculate_voting_score(votings),
      image_url: image_public_url(post.id, post.has_image)
    }
  end

  defp image_public_url(id, false) do
    nil
  end

  defp image_public_url(id, true) do
    # TODO: clean up this horrible mess (Openjodel referencing OpenjodelWeb? Wtf?)
    "#{OpenjodelWeb.Endpoint.url}#{OpenjodelWeb.Endpoint.static_path("/uploads/posts/#{id}-image.jpg")}"
  end

  defp user_voting_score(votings, user_id) do
    votings
    |> Enum.filter(fn voting -> voting.user_id == user_id end)
    |> Enum.map(fn voting -> voting.score end)
    |> Enum.at(0)
  end

  defp calculate_voting_score(votings) do
    votings 
    |> Enum.map(fn vote -> vote.score end)
    |> Enum.sum()
  end
end
