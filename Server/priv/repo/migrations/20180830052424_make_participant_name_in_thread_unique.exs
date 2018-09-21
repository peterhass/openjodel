defmodule Openjodel.Repo.Migrations.MakeParticipantNameInThreadUnique do
  use Ecto.Migration

  def change do
    create index("participants", [:post_id, :name], unique: true)
  end
end
