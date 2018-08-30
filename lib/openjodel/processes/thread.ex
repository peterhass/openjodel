defmodule Openjodel.Processes.Thread do

  alias Openjodel.{Repo, Post, User, Participant}
  # import Ecto.Query

  def start_thread(%User{} = user, post_attrs) do
    {:ok, result} = Repo.transaction fn ->
      Post.post_to_insert_now 
      |> Post.thread_changeset(post_attrs)
      |> Repo.insert
      |> case do
        {:ok, thread} ->
          participant = new_participant_changeset(user.id, thread.id, fn -> "OJ" end)
          |> Repo.insert!

          thread = thread 
                  |> Ecto.Changeset.change(participant_id: participant.id)
                  |> Repo.update!

          {:ok, thread}
        {:error, _} = error -> error 
      end

    end

    result
  end

  def add_post(%User{} = user, %{parent_id: thread_id} = post_attrs) do
    ensure_participant_exists(user.id, thread_id)
    
    {:ok, result} = Repo.transaction fn ->
      participant = Repo.get_by!(Participant, user_id: user.id, post_id: thread_id)

      %Post{participant_id: participant.id}
      |> Post.post_to_insert_now 
      |> Post.post_changeset(post_attrs)
      |> Repo.insert
    end

    result
  end

  def vote_post() do
    # TODO
    # TODO: add unique constraint to :votings, [:user_id, :post_id]
    # insert zero score voting for [:user_id, :post_id] (on_conflict: :nothing)
    # transaction do
    #   get voting for update
    #   set score
    #   save voting to db
    # end
  end

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
