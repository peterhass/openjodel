defmodule Openjodel.Processes.Thread do

  alias Openjodel.{Repo, Post, User, Participant, PaginatedPosts, Voting, StreamPost, Stream}
  import Ecto.Query

  defmodule PostQuery do
    def init(queryable, opts \\ []) do
      order_by = case opts[:reverse_order] do
        true -> [asc: :inserted_at, asc: :id]
        _ -> [desc: :inserted_at, desc: :id]
      end

    
      queryable |> from(preload: [votings: [], participant: []], order_by: ^order_by)
    end

  end

  def find_thread(id) do
    Post
    |> PostQuery.init
    |> Repo.get(id)
  end

  def find_post(id) do
    find_thread(id)
  end

  def paginated_posts_in_thread(thread_id, cursor) do
   Post
    |> PostQuery.init(reverse_order: true)
    |> where([p], p.parent_id == ^thread_id)
    |> Repo.paginate(cursor_fields: [:inserted_at, :id], sort_direction: :asc, limit: cursor[:limit] || 50, before: cursor[:before], after: cursor[:after])
    |> PaginatedPosts.from_pagination
  end

  # TODO: extract into some other module
  def paginated_threads_in_stream(stream_id, cursor) do
    Post
    |> PostQuery.init
    |> Post.parents
    |> join(:inner, [p], ps in StreamPost, p.id == ps.post_id and ps.stream_id == ^stream_id)
    |> Repo.paginate(cursor_fields: [:inserted_at, :id], sort_direction: :desc, limit: cursor[:limit] || 50, before: cursor[:before], after: cursor[:after])
    |> PaginatedPosts.from_pagination
  end

  def start_thread(%User{} = user, post_attrs) do
    {:ok, result} = Repo.transaction fn ->
      %Post{has_image: !!post_attrs[:image]}
      |> Post.post_to_insert_now 
      |> Post.thread_changeset(post_attrs)
      |> Repo.insert
      |> case do
        {:ok, thread} ->
          participant = new_participant_changeset(user.id, thread.id, fn -> "OJ" end)
          |> Repo.insert!

          thread = thread 
                  |> Ecto.Changeset.change(participant_id: participant.id)
                  |> Repo.update!

          if post_attrs[:image] do
            Openjodel.PostImageUpload.store(thread, post_attrs.image.path)
          end

          {:ok, thread}
        {:error, _} = error -> error 
      end

      # TODO: handle post image
      # TODO: rollback everything if there is a problem with the image
    end

    result
  end

  def add_post(%User{} = user, %{parent_id: thread_id} = post_attrs) do
    ensure_participant_exists(user.id, thread_id)

    IO.inspect("post attrs")
    IO.inspect(post_attrs)

    {:ok, result} = Repo.transaction fn ->
      participant = Repo.get_by!(Participant, user_id: user.id, post_id: thread_id)

      {:ok, post} = %Post{participant_id: participant.id, has_image: !!post_attrs[:image]}
      |> Post.post_to_insert_now 
      |> Post.post_changeset(post_attrs)
      |> Repo.insert

      # TODO: handle post image
      # TODO: rollback everything if there is a problem with the image
      if post_attrs[:image] do
        Openjodel.PostImageUpload.store(post, post_attrs.image.path)
      end

      {:ok, post}
    end

    result
  end

  def vote_post(%User{id: user_id}, %{post_id: post_id, score: score}) do
    # ensure voting record exists for locking to work
    %Voting{inserted_at: Calendar.DateTime.now_utc}
    |> Voting.changeset(%{user_id: user_id, post_id: post_id, score: 0})
    |> Repo.insert!(on_conflict: :nothing)

    # update voting
    Voting
    |> lock("FOR UPDATE")
    |> Repo.get_by(user_id: user_id, post_id: post_id)
    |> case do
      nil -> %Voting{}
      voting -> voting
    end
    |> Map.put(:inserted_at, Calendar.DateTime.now_utc)
    |> Voting.changeset(%{user_id: user_id, post_id: post_id, score: safe_voting_score(score)})
    |> Repo.insert_or_update
  end

  defp safe_voting_score(score) when score > 0, do: 1
  defp safe_voting_score(score) when score < 0, do: -1
  defp safe_voting_score(_score), do: 0

  defp ensure_participant_exists(user_id, thread_id) do
    create_participant(user_id, thread_id)
    |> case do
      {:ok, _participant} -> nil
      {:error, %{errors: [user_in_thread_exists: _]}} -> nil
      {:error, any_other_error} -> throw(any_other_error)
    end
  end

  defp create_participant(user_id, thread_id, tries \\ 0)

  defp create_participant(user_id, thread_id, tries) when tries < 5 do
    name_generator = &Faker.Internet.user_name/0
    
    new_participant_changeset(user_id, thread_id, name_generator)
    |> Repo.insert
    |> case do
      {:ok, participant} -> {:ok, participant}
      {:error, %{errors: [user_in_thread_taken: _]}} -> create_participant(user_id, thread_id, tries + 1)
      {:error, any_other_error} -> {:error, any_other_error} 
    end
  end

  defp create_participant(_, _, _) do
    {:error, "Unable to create participant: Unable to generate non-existing username in thread"}
  end

  defp new_participant_changeset(user_id, thread_id, name_generator) do
    %Participant{}
    |> Participant.changeset(%{user_id: user_id, post_id: thread_id, name: name_generator.()})
  end
end
