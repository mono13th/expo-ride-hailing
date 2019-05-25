import React, { Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { MapView } from "expo";

import DestinationSearch from "../components/DestinationSearch";

class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: {
        latitude: 0,
        longitude: 0
      },
      routePathCoords: [],
      error: null
    };
  }

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          error: null
        });
      },
      err => {
        this.setState({ error: error.message });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    );
  };

  handleRouteLoaded = routePathCoords => {
    const self = this;
    setTimeout(() => {
      self.setState({ routePathCoords });
    }, 1000);
    this.refs.map.fitToCoordinates(routePathCoords, {
      edgePadding: { top: 350, right: 150, bottom: 150, left: 150 },
      animated: true
    });
  };

  render() {
    const { userLocation, routePathCoords } = this.state;
    // TODO: Add loading state here to center map on user's location
    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          initialRegion={{
            latitude: 30.2672,
            longitude: -97.7431,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          showsUserLocation={true}
        >
          {routePathCoords.length > 0 && (
            <Fragment>
              <MapView.Polyline
                coordinates={routePathCoords}
                strokeWidth={5}
                strokeColor="#ff0000"
              />
              <MapView.Marker
                coordinate={routePathCoords[routePathCoords.length - 1]}
              />
            </Fragment>
          )}
        </MapView>
        <DestinationSearch
          userLocation={userLocation}
          onRouteLoaded={this.handleRouteLoaded}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

export default Driver;
