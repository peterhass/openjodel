defmodule Openjodel.Posts.StartThread do
  alias Openjodel.{Repo, Post, User, Participant, PaginatedPosts, Voting, StreamPost, Stream}
  import Ecto.Query

  def start(%User{} = user, post_attrs) do
    {:ok, result} =
      Repo.transaction(fn ->
        %Post{has_image: !!post_attrs[:image]}
        |> Post.post_to_insert_now()
        |> Post.thread_changeset(post_attrs)
        |> Repo.insert()
        |> case do
          {:ok, thread} ->
            participant =
              new_participant_changeset(user.id, thread.id, fn -> "OJ" end)
              |> Repo.insert!()

            thread =
              thread
              |> Ecto.Changeset.change(participant_id: participant.id)
              |> Repo.update!()

            if post_attrs[:image] do
              Openjodel.PostImageUpload.store(thread, post_attrs.image.path)
            end

            {:ok, thread}

          {:error, _} = error ->
            error
        end

        # TODO: handle post image
        # TODO: rollback everything if there is a problem with the image
      end)

    result
  end

  defp new_participant_changeset(user_id, thread_id, name_generator) do
    %Participant{}
    |> Participant.changeset(%{user_id: user_id, post_id: thread_id, name: name_generator.()})
  end
end
