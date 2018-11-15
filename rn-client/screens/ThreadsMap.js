import React from 'react'
import {
  Text,
  View,
  StyleSheet
} from 'react-native'
import {
  MapView, 
  Permissions, 
  Location
} from 'expo'

export default class ThreadsMap extends React.Component {

  constructor() {
    super()
  }
  
  render() {
    return (
      <MapView
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
      >
        {this.props.threads.map(thread => (
          <MapView.Marker 
            key={thread.id}
            coordinate={{
              longitude: thread.anonymizedGeog.coordinates[0],
              latitude: thread.anonymizedGeog.coordinates[1]
            }} 
          />
        ))}
      </MapView>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
})
