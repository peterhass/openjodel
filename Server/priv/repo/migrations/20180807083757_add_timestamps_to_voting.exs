defmodule Openjodel.Repo.Migrations.AddTimestampsToVoting do
  use Ecto.Migration

  def change do
    alter table("votings") do
      timestamps(type: :utc_datetime, updated_at: false)
    end
  end
end
