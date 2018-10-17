defmodule Openjodel.Repo.Migrations.CreateStreams do
  use Ecto.Migration

  def change do
    create table("streams") do
      add :geog, :geography
      timestamps type: :utc_datetime, updated_at: false
    end

    create table("stream_posts") do
      add :stream_id, references(:streams)
      add :post_id, references(:posts)
      timestamps type: :utc_datetime, updated_at: false
    end
  end
end
