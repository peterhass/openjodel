defmodule OpenjodelWeb.PostView do
  alias Openjodel.{Post, User}

  defmodule GeoCalc do
    # https://stackoverflow.com/a/50506609
    def add_meters({lon, lat}, {lon_m, lat_m}) do
      earth_radius = 6378.137
      pi = :math.pi
      degrees_per_meter = (1 / ((2 * pi / 360) * earth_radius)) / 1000 # 1 meter in degree


      {
        lon + (lon_m * degrees_per_meter) / :math.cos(lat * (pi / 180)),
        lat + (lat_m * degrees_per_meter)
      }
    end
  end
  
  defstruct [:id, 
             :inserted_at, 
             :message, 
             :parent_id, 
             :participant, 
             :voting_score, 
             :current_user_voting_score,
             :anonymized_geog,
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
      image_url: image_public_url(post.id, post.has_image),
      anonymized_geog: anonymized_geog(post.geog)
    }
  end

  def anonymized_geog(nil), do: nil  
  def anonymized_geog(%{coordinates: {lon, lat}, properties: properties}) do
    anonymize_radius = 1000

    sign = :rand.uniform(2)
           |> case do
             1 -> -1
             2 -> 1
           end

    {anon_lon, anon_lat} = GeoCalc.add_meters(
      {
        lon, 
        lat
      },
      {
        :rand.uniform(anonymize_radius) * sign,
        :rand.uniform(anonymize_radius) * sign
      })

    %{
      coordinates: [
        anon_lon,
        anon_lat
      ],
      properties: properties,
      srid: 4326
    }
  end


  defp image_public_url(id, false), do: nil
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
