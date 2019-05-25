import React, { Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { MapView } from "expo";
import socketIO from "socket.io-client";

import Button from "../components/Button";
import DestinationSearch from "../components/DestinationSearch";
import THEME from "../theme";
import { SOCKET_BASE_URL } from "../constants";

class Passenger extends React.Component {
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

  handleRouteLoaded = (routePathCoords, resp) => {
    const self = this;
    setTimeout(() => {
      self.setState({ routePathCoords, routeResponse: resp });
    }, 1000);
    this.refs.map.fitToCoordinates(routePathCoords, {
      edgePadding: { top: 550, right: 150, bottom: 350, left: 150 },
      animated: true
    });
  };

  requestDriver = () => {
    const socket = socketIO.connect(SOCKET_BASE_URL);
    socket.on("connect", () => {
      socket.emit("rideRequest", this.state.routeResponse);
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
        {routePathCoords.length > 0 && (
          <View style={styles.request}>
            <Button onPress={this.requestDriver} label="Request Driver" />
          </View>
        )}
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
  },
  request: {
    marginTop: "auto",
    marginBottom: THEME.spacing.lg,
    marginLeft: THEME.spacing.lg,
    marginRight: THEME.spacing.lg
  }
});

export default Passenger;
