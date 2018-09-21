defmodule Openjodel.Repo.Migrations.AddParticipantsToPosts do
  use Ecto.Migration

  def change do
    alter table("posts") do
      add :participant_id, references(:participants)
    end
  end
end
