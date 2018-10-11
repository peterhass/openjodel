defmodule Openjodel.PostImageUpload do

  alias Openjodel.Post

  @root_dir File.cwd!
  @uploads_dir Path.join(~w(#{@root_dir} priv static uploads posts))

  def store(%Post{} = post, upload_path) when is_binary(upload_path) do
    File.exists?(upload_path)
    |> case do
      false -> {:error, "Upload file does not exist"}
      true -> {:ok, unsafe_store(post, upload_path)}
    end
  end

  defp unsafe_store(%Post{id: id}, upload_path) do
    # TODO: transform image
    extension = Path.extname(upload_path) # TODO: convert all images to the same format
    target_path = Path.join(@uploads_dir, "#{id}-image.jpg")
    
    File.cp(upload_path, target_path)

    target_path
  end
end
