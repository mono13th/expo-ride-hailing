import React, { Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { MapView } from "expo";
import socketIO from "socket.io-client";

import Button from "../components/Button";
import DestinationSearch from "../components/DestinationSearch";
import MapAction from "../components/MapAction";
import { SOCKET_BASE_URL } from "../constants";
import { withLocation } from "../utils/with-location";
import { getRouteDirections } from "../utils/get-route-directions";
import { buildRoutePolyline } from "../utils/build-route-polyline";

class Passenger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polylineToDestination: [],
      ridePlaceIds: null
    };
  }

  handleDestinationSelect = async placeId => {
    const { userLocation } = this.props;
    const { latitude, longitude } = userLocation;
    // Get directions to selected destination
    const route = await getRouteDirections(
      `${latitude},${longitude}`,
      `place_id:${placeId}`
    );
    if (route) {
      // Convert directions to usable polyline coords
      const polylineCoords = buildRoutePolyline(route);
      // Pull off the passenger and destination place ids
      // to send off to the server
      const [passenger, destination] = route.geocoded_waypoints;
      this.setState({
        ridePlaceIds: {
          passenger: passenger.place_id,
          destination: destination.place_id
        }
      });
      this.refs.map.fitToCoordinates(polylineCoords, {
        edgePadding: { top: 550, right: 150, bottom: 350, left: 150 },
        animated: true
      });
      // Delay updating polyline state until animation is complete
      setTimeout(() => {
        this.setState({
          polylineToDestination: polylineCoords
        });
      }, 1000);
    }
  };

  requestDriver = () => {
    const socket = socketIO.connect(SOCKET_BASE_URL);
    const { ridePlaceIds } = this.state;
    socket.on("connect", () => {
      // Sned off the passenger and destination placeID
      if (ridePlaceIds) {
        socket.emit("requestRide", ridePlaceIds);
      }
    });
  };

  render() {
    const { polylineToDestination } = this.state;
    const { userLocation } = this.props;
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
          {polylineToDestination.length > 0 && (
            <Fragment>
              <MapView.Polyline
                coordinates={polylineToDestination}
                strokeWidth={5}
                strokeColor="#ff0000"
              />
              <MapView.Marker
                coordinate={
                  polylineToDestination[polylineToDestination.length - 1]
                }
              />
            </Fragment>
          )}
        </MapView>
        <DestinationSearch
          userLocation={userLocation}
          onDestinationSelect={this.handleDestinationSelect}
        />
        {polylineToDestination.length > 0 && (
          <MapAction>
            <Button onPress={this.requestDriver} label="Request Driver" />
          </MapAction>
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
  }
});

export default withLocation(Passenger);
