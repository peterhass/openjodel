defmodule OpenjodelWeb.TokenAuthentication do
  alias Openjodel.{Repo, User}
  import Ecto.Query
  
  def authorize(token) do
    User 
    |> where([p], p.token == ^token)
    |> Repo.one()
    |> case do
      nil -> {:error, "invalid auth token"}
      user -> {:ok, user}
    end
  end

end
