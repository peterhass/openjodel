defmodule Openjodel.Processes.Thread do

  alias Openjodel.{Repo, Post, User, Participant}
  import Ecto.Query

  def start_thread(%User{} = user, post_attrs) do
    {:ok, result} = Repo.transaction fn ->
      Post.post_to_insert_now 
      |> Post.thread_changeset(post_attrs)
      |> Repo.insert
      |> case do
        {:ok, thread} ->
          participant = Ecto.build_assoc(thread, :participants, user_id: user.id, name: "XX")
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
    # TODO: if creating post fails, participant would still be present, ...
    %Participant{}
    |> Participant.changeset(%{user_id: user.id, post_id: thread_id, name: "XX"})
    |> Repo.insert!(on_conflict: :nothing)
    
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
end
