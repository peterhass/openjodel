import React from 'react'
import { ActivityIndicator, Modal, View, Text, FlatList, Button, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { MapView, Permissions, Location } from 'expo'
import _ from 'lodash'

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
      this.setState({ ...this.state, region: newRegion }, () => {
        if(this.props.onChangeLocation)
          this.props.onChangeLocation( newRegion )
      })
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
        />
      </MapView>
    )
  }

  onRegionChange(location) {
    this.setState({ ...this.state, region: location }, () => {
      const cb = this.props.onChangeLocation

      if(cb) {
        cb(location)
      }
    })
  }
}

export default class NewStream extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <Button
        onPress={navigation.getParam('onCreate') || (() => {})}
        title="Next"
      />
    )
  })

  constructor() {
    super()

    this.state = { name: '', location: null, loading: false }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onCreate: this.onCreate.bind(this) })
  }


  render() {
    const { name, loading } = this.state

    return (
      <View style={{ flex: 1, height: '100%' }}> 
        <Modal
          visible={loading}
          animationType="slide"
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" style={{ marginBottom: 10 }} />
             <Text>Creating stream ...</Text>
          </View>
        </Modal>
        <View style={styles.nameInputContainer}>
          <TextInput
            style={styles.nameInput}
            onChangeText={(name) => this.setState({...this.state, name})}
            placeholder="Stream name (eg. 'Vienna')"
            value={name}
          />
        </View>
        <LocationSelection 
          onChangeLocation={(location) => this.setState({...this.state, location})}
        />
      </View>
    )
  }

  onCreate() {
    const { name, location } = this.state
    const nameIsEmpty = !_.trim(name)
    if (nameIsEmpty) { 
      return;
    }

    this.setState({ ...this.state, loading: true })

    this.props.onCreateStream({
      name,
      latitude: location.latitude,
      longitude: location.longitude
    })
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
