defmodule Openjodel.Streams do
  alias Openjodel.{
    Repo,
    Stream,
    User
  }
  
  import Ecto.Query
  
  def create(_user, attrs) do
    Stream.stream_to_insert_now
    |> Stream.changeset(attrs)  
    |> Repo.insert
  end
end
