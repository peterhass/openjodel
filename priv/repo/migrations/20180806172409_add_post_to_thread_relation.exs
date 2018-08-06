defmodule Openjodel.Repo.Migrations.AddPostToThreadRelation do
  use Ecto.Migration

  def change do
    alter table("posts") do
      add :parent_id, references(:posts)
    end
  end
end
