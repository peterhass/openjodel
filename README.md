# Openjodel

[Jodel](https://www.jodel-app.com/) clone based on Elixir, Phoenix, React and GraphQL. Kind of a tech demo to show performance benifits from using elixir with phoenix.


## Differences to Jodel

- More chat-like experience: No need to refresh page to see new data
- (not yet implemented) GPS tracking settings: Users should be able to control the location precision of their post (eg. "Hey guys, come meet us" -> Location percision)
- (not yet implemented) Streams: Streams are a collection of threads. Instead of being bound to specific cities, users should be able to control the radius of posts they want to have in their streams.



# Phoenix
To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
