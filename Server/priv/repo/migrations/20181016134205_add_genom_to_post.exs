defmodule Openjodel.Repo.Migrations.AddGenomToPost do
  use Ecto.Migration

  def change do
    alter table("posts") do
      add :geog, :geography
    end
  end
end
