defmodule Openjodel.Post do
  use Ecto.Schema
  import Ecto.Changeset
  alias Openjodel.{Post, Voting, Participant}

  schema "posts" do
    field :message, :string
    field :inserted_at, :utc_datetime
    field :has_image, :boolean
    field :geog, Geo.PostGIS.Geometry

    has_many :children, Post, foreign_key: :parent_id
    belongs_to :parent, Post
    has_many :votings, Voting

    # threads have many participants
    has_many :participants, Participant

    # posts belong to one participant in thread
    belongs_to :participant, Participant
  end

  def changeset(%Post{} = post, attrs) do
    post 
    |> cast(attrs, [:has_image, :geog, :message, :inserted_at, :parent_id])
    |> foreign_key_constraint(:parent_id)
    |> foreign_key_constraint(:participant_id)
    |> validate_message_or_post
    |> validate_required([:geog, :inserted_at])
  end


  def post_changeset(%Post{} = post, attrs) do
    post 
    |> cast(attrs, [:has_image, :geog, :message, :inserted_at, :parent_id])
    |> foreign_key_constraint(:parent_id)
    |> foreign_key_constraint(:participant_id)
    |> validate_message_or_post
    |> validate_required([:geog, :inserted_at, :participant_id, :parent_id])
  end

  def thread_changeset(%Post{} = post, attrs) do
    post
    |> cast(attrs, [:geog, :has_image, :message, :inserted_at])
    |> validate_message_or_post
    |> validate_required([:geog])
  end

  defp validate_message_or_post(changeset) do
    if get_field(changeset, :has_image) do
      changeset
      |> validate_inclusion(:has_image, [true])
    else
      changeset
      |> validate_required(:message)
    end
  end

  def post_to_insert_now(%Post{} = post \\ %Post{}) do
    %{post | inserted_at: Calendar.DateTime.now_utc}
  end


  def parents(query) do
    import Ecto.Query
    from p in query, where: is_nil(p.parent_id)
  end

  def from_parent(query, parent_id) do
    import Ecto.Query
    from p in query, where: p.parent_id == ^parent_id
  end


  
end
