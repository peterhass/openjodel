defmodule Openjodel.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table("users") do
      add :token, :uuid
    end
  end
end
