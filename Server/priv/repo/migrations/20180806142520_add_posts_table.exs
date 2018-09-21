defmodule Openjodel.Repo.Migrations.AddPostsTable do
  use Ecto.Migration

  def change do
    create table("posts") do
      add :message, :string
      add :inserted_at, :utc_datetime
    end
  end
end
