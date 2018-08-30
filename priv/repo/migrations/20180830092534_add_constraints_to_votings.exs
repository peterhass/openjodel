defmodule Openjodel.Repo.Migrations.AddConstraintsToVotings do
  use Ecto.Migration

  def change do
    alter table(:votings) do
      modify :post_id, :id, null: false
      modify :user_id, :id, null: false
    end

    create unique_index(:votings, [:post_id, :user_id])
  end
end
