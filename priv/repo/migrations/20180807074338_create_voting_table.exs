defmodule Openjodel.Repo.Migrations.CreateVotingTable do
  use Ecto.Migration

  def change do
    create table("votings") do
      add :post_id, references(:posts)
      add :score, :integer
    end
  end
end
