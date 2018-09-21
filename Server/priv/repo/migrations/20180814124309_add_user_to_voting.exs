defmodule Openjodel.Repo.Migrations.AddUserToVoting do
  use Ecto.Migration

  def change do
    alter table("votings") do
      add :user_id, references(:users)
    end
  end
end
