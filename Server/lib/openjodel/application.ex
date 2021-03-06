defmodule Openjodel.Application do
  use Application

  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Start the Ecto repository
      supervisor(Openjodel.Repo, []),
      # Start the endpoint when the application starts
      supervisor(OpenjodelWeb.Endpoint, []),
      # Start your own worker by calling: Openjodel.Worker.start_link(arg1, arg2, arg3)
      # worker(Openjodel.Worker, [arg1, arg2, arg3]),
      supervisor(Absinthe.Subscription, [OpenjodelWeb.Endpoint]),

      worker(OpenjodelWeb.Streams.Server, []),

      worker(Openjodel.Scheduler, [])
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Openjodel.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    OpenjodelWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
