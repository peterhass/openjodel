defmodule Openjodel.Users do
  alias Openjodel.{
    User,
    Repo
  }

  import Ecto.Query

  defmodule Query do
    def find_by(token) do
      User
      |> where([u], u.token == ^token)
      |> Repo.one()
    end
  end

  def signup do
    User.with_token()
    |> User.changeset(%{})
    |> Repo.insert!()
  end
end
