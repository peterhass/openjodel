defmodule Openjodel.Repo.Migrations.AddParticipants do
  use Ecto.Migration

  def change do
    create table("participants") do
      add :post_id, references(:posts)
      add :name, :string
      add :user_id, references(:users)
    end
  end
end
