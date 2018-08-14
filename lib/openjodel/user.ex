defmodule Openjodel.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Openjodel.{User}

  schema "users" do
    field :token, Ecto.UUID
  end

  def with_token(%User{} = user \\ %User{}) do
    %User{user | token: Ecto.UUID.generate}
  end

  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [])
    |> validate_required(:token)
  end
end

