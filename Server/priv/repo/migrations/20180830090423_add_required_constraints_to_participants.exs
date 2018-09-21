defmodule Openjodel.Repo.Migrations.AddRequiredConstraintsToParticipants do
  use Ecto.Migration

  def up do

    alter table(:participants) do
      modify :user_id, :id, null: false
      modify :post_id, :id, null: false
      modify :name, :string, null: false
    end
  end

  def down do

    alter table(:participants) do
      modify :user_id, :id, null: true
      modify :post_id, :id, null: true
      modify :name, :string, null: true
    end
  end
end
