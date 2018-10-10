defmodule Openjodel.Repo.Migrations.AddPictureToPost do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :has_image, :boolean, default: false
    end
  end
end
