import { Permissions } from 'expo'
import Settings from './Settings'
import gql from 'graphql-tag'

const PROVIDE_STREAM_MUTATION = gql`
mutation ProvideStream($latitude: Float, $longitude: Float) {
  provideStream(geog: [$longitude, $latitude]) {
    id
    name
  }
}
`

export default class HomeScreenLocator {
  constructor() {
    this.graphqlClient = null
    this._locationChanged = this._locationChanged.bind(this)
  }

  async start() {
    await Permissions.askAsync(Permissions.LOCATION)

    this.watchId = this.service.watchPosition(this._locationChanged, null, {
      useSignificantChanges: true 
    })
  }

  stop() {
    this.service.clearWatch(this.watchId)
  }

  // TODO: multiple calls to this could lead to problems if previouses call's mutation did not fire onCompleted yet
  async _locationChanged({ coords, _timestamp }) {
    console.log('location changed!', arguments)

    console.log("graphql client", !!this.graphqlClient)
    if(!this.graphqlClient)
      return

    const { data: { provideStream: stream } } = await this.graphqlClient.mutate({
      mutation: PROVIDE_STREAM_MUTATION,
      variables: {
        latitude: coords.latitude,
        longitude: coords.longitude
      }
    })

    console.log("Mutation returned following stream: ", stream)
    await Settings.homeStreamId.setAsync(stream.id)
  }

  get service() { return navigator.geolocation }
}
