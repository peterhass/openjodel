defmodule Openjodel.Repo.Migrations.AddConstraintsToParticipants do
  use Ecto.Migration

  def change do
    create index("participants", [:post_id, :user_id], unique: true)
  end
end
