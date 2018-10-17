defmodule Openjodel.Posts.AddPost do
  alias Openjodel.{Repo, Post, User, Participant, PaginatedPosts, Voting, StreamPost, Stream}
  import Ecto.Query

  def add(%User{} = user, %{parent_id: thread_id} = post_attrs) do
    ensure_participant_exists(user.id, thread_id)

    IO.inspect("post attrs")
    IO.inspect(post_attrs)

    {:ok, result} =
      Repo.transaction(fn ->
        participant = Repo.get_by!(Participant, user_id: user.id, post_id: thread_id)

        {:ok, post} =
          %Post{participant_id: participant.id, has_image: !!post_attrs[:image]}
          |> Post.post_to_insert_now()
          |> Post.post_changeset(post_attrs)
          |> Repo.insert()

        # TODO: handle post image
        # TODO: rollback everything if there is a problem with the image
        if post_attrs[:image] do
          Openjodel.PostImageUpload.store(post, post_attrs.image.path)
        end

        {:ok, post}
      end)

    result
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
    |> Repo.insert()
    |> case do
      {:ok, participant} ->
        {:ok, participant}

      {:error, %{errors: [user_in_thread_taken: _]}} ->
        create_participant(user_id, thread_id, tries + 1)

      {:error, any_other_error} ->
        {:error, any_other_error}
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
