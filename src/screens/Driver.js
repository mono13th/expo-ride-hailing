import React, { Fragment } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { MapView } from "expo";
import socketIO from "socket.io-client";

import Button from "@components/Button";
import MapAction from "@components/MapAction";
import Marker from "@components/Marker";
import Route from "@components/Route";
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

  findPassengers = () => {
    this.setState({ findingPassengers: true });
    const socket = socketIO.connect(SOCKET_BASE_URL);
    socket.on("connect", () => {
      socket.emit("findPassengers");
    });
    // When a user requests a ride...
    socket.on("rideRequested", async ridePlaceIds => {
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
    });
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
                <ActivityIndicator
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
