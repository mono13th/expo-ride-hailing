import React, { Fragment } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { MapView } from "expo";
import { Platform } from "expo-core";
import socketIO from "socket.io-client";

import Button from "@components/Button";
import MapAction from "@components/MapAction";
import Marker from "@components/Marker";
import Route from "@components/Route";
import Loader from "@components/Loader";
import THEME from "@theme";
import { SOCKET_BASE_URL } from "@constants";
import { withLocation } from "@utils/with-location";
import { getRouteDirections } from "@utils/get-route-directions";
import { buildRoutePolyline } from "@utils/build-route-polyline";

class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passengerFound: false,
      findingPassengers: false,
      routeToPassenger: []
    };
  }

  componentDidMount = () => {
    this.socket = socketIO.connect(SOCKET_BASE_URL);
    this.socket.on("rideRequested", ridePlaceIds => {
      this.handleRideRequested(ridePlaceIds);
    });
  };

  handleRideRequested = async ridePlaceIds => {
    const { userLocation } = this.props;
    const { latitude, longitude } = userLocation;
    // Find directions to the passenger
    // and draw them on the map
    const route = await getRouteDirections(
      `${latitude},${longitude}`,
      `place_id:${ridePlaceIds.passenger}`
    );
    if (route) {
      const polylineCoords = buildRoutePolyline(route);
      setTimeout(() => {
        this.setState({
          routeToPassenger: polylineCoords,
          findPassengers: false,
          passengerFound: true
        });
      }, 1000);
      this.refs.map.fitToCoordinates(polylineCoords, {
        edgePadding: { top: 550, right: 150, bottom: 350, left: 150 },
        animated: true
      });
    }
  };

  findPassengers = () => {
    this.setState({ findingPassengers: true });
    this.socket.emit("findPassengers");
  };

  acceptRide = () => {
    const { userLocation } = this.props;
    const { routeToPassenger } = this.state;
    const passengerLatLng = routeToPassenger[routeToPassenger.length - 1];
    this.socket.emit("rideAccepted", userLocation);
    if (Platform.OS === "ios") {
      Linking.openURL(
        `http://maps.apple.com/?daddr=${passengerLatLng.latitude},${
          passengerLatLng.longitude
        }`
      );
    } else {
      Linking.openURL(
        `https://maps.google.com/?daddr=${passengerLatLng.latitude},${
          passengerLatLng.longitude
        }`
      );
    }
  };

  render() {
    const { findingPassengers, routeToPassenger, passengerFound } = this.state;
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
          {routeToPassenger.length > 0 && (
            <Fragment>
              <Route coordinates={routeToPassenger} />
              <Marker
                coordinate={routeToPassenger[routeToPassenger.length - 1]}
              />
            </Fragment>
          )}
        </MapView>
        <MapAction>
          {!passengerFound ? (
            <Button onPress={this.findPassengers} label="Find Passengers">
              {findingPassengers && (
                <Loader
                  style={styles.indicator}
                  animating={findingPassengers}
                />
              )}
            </Button>
          ) : (
            <Button onPress={this.acceptRide} label="Accept Ride" />
          )}
        </MapAction>
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
  indicator: {
    marginLeft: THEME.spacing.sm
  }
});

export default withLocation(Driver);
