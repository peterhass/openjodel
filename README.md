# Openjodel

[Jodel](https://www.jodel-app.com/) clone based on Elixir, Phoenix, React and GraphQL. Kind of a tech demo to show performance benifits from using elixir with phoenix.

**Important note: 💣 Definitively not stable 💣**

## Differences to Jodel

- More chat-like experience: No need to refresh page to see new data
- (not yet implemented) GPS tracking settings: Users should be able to control the location precision of their post (eg. "Hey guys, come meet us" -> Location percision)
- (not yet implemented) Streams: Streams are a collection of threads. Instead of being bound to specific cities, users should be able to control the radius of posts they want to have in their streams.



# Server
To start your Phoenix server:

  * Navigate to `Server/`
  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Start Phoenix endpoint with `mix phx.server`

# Client
To start Expo:

  * Navigate to `rn_client/`
  * Install dependencies with `yarn`
  * Start expo using `npm start`

