import React from 'react'
import { ActivityIndicator, Modal, View, Text, FlatList, Button, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { MapView, Permissions, Location } from 'expo'

class LocationSelection extends React.Component { 
  constructor() {
    super()

    this.state = {
      userCoords: {
        latitude: 0,
        longitude: 0
      },
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      radius: 500
    }
  }

  componentWillMount() {
    const loadUserLocationIntoMap = async () => {
      await Permissions.askAsync(Permissions.LOCATION)

      const { coords } = await Location.getCurrentPositionAsync();
      const newRegion = { ...this.state.region, latitude: coords.latitude, longitude: coords.longitude }
      this.setState({ ...this.state, region: newRegion })
    }

    loadUserLocationIntoMap()
  }

  render() {
    return (
      <MapView
        latitudeDelta={0.0922}
        longitudeDelta={0.0421}
        style={styles.map}
        showUserLocation
        followUserLocation
        region={this.state.region}
        onRegionChange={this.onRegionChange.bind(this)}
      >
        <MapView.Marker
          coordinate={this.state.region} />
        <MapView.Circle 
          center={this.state.region}
          radius={this.state.radius}
          fillColor="red"
        />
      </MapView>
    )
  }

  onRegionChange(location) {
    this.setState({ ...this.state, region: location })
  }
}

export default class NewStream extends React.Component {
  static navigationOptions = {}

  constructor() {
    super()

    this.state = { name: '' }
  }


  render() {
    const { name } = this.state

    return (
      <View style={{ flex: 1, height: '100%' }}>
        <View style={styles.nameInputContainer}>
          <TextInput
            style={styles.nameInput}
            onChangeText={(name) => this.setState({name})}
            placeholder="Stream name (eg. 'Vienna')"
            value={name}
          />
        </View>
        <LocationSelection />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  nameInputContainer: {
    padding: 10
  },

  nameInput: {
    borderRadius: 5,
    padding: 10,
    fontSize: 30
  }
})
