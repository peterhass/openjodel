defmodule Openjodel.Repo.Migrations.AddPreventOverlappingStreamsTrigger do
  use Ecto.Migration

  def up do
    # TODO: replace magic value 500 (stream radius)
    # TODO: think of a more vebose solution of stopping the insert
    execute("""
    CREATE OR REPLACE FUNCTION validate_stream_location() RETURNS TRIGGER AS $$
      BEGIN
      IF EXISTS (SELECT 1 FROM streams WHERE ST_DWithin(NEW.geog, streams.geog, 500 + 500)) THEN
        -- RAISE EXCEPTION 'Overlapping streams not allowed';
        RETURN NULL;
      END IF;

      RETURN NEW;
      END;
    $$ LANGUAGE plpgsql;
    """)

    execute("""
    CREATE TRIGGER stream_location_check 
    BEFORE INSERT OR UPDATE
    ON streams
    FOR EACH ROW
    EXECUTE PROCEDURE validate_stream_location();
    """)
  end

  def down do
    execute("DROP TRIGGER stream_location_check ON streams")
    execute("DROP FUNCTION validate_stream_location")
  end
end
