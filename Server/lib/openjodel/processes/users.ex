defmodule Openjodel.Processes.Users do
  alias Openjodel.{Repo, User}
  import Ecto.Query
  
  def find_user_by_token(token) do
    User
    |> where([u], u.token == ^token)
    |> Repo.one
  end

  def signup do
    User.with_token 
    |> User.changeset(%{})
    |> Repo.insert!
  end
end
