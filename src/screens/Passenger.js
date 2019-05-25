import React, { Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { MapView } from "expo";
import socketIO from "socket.io-client";

import Button from "@components/Button";
import DestinationSearch from "@components/DestinationSearch";
import Marker from "@components/Marker";
import DriverMarker from "@components/DriverMarker";
import MapAction from "@components/MapAction";
import Route from "@components/Route";
import Loader from "@components/Loader";
import THEME from "@theme";
import { SOCKET_BASE_URL } from "@constants";
import { withLocation } from "@utils/with-location";
import { getRouteDirections } from "@utils/get-route-directions";
import { buildRoutePolyline } from "@utils/build-route-polyline";

class Passenger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polylineToDestination: [],
      ridePlaceIds: null,
      findingDriver: false,
      driverLocation: null
    };
  }

  componentDidMount = () => {
    this.socket = socketIO.connect(SOCKET_BASE_URL);
    this.socket.on("driverLocationChange", driverLocation => {
      this.handleDriveLocationChange(driverLocation);
    });
    this.socket.on("driverFound", driverLocation => {
      this.handleDriverFound(driverLocation);
    });
  };

  handleDriverFound = driverLocation => {
    const { polylineToDestination } = this.state;
    this.setState({ findingDriver: false, driverLocation });
    // Zoom the map out including the driver location, now
    this.refs.map.fitToCoordinates([...polylineToDestination, driverLocation], {
      edgePadding: { top: 550, right: 150, bottom: 350, left: 150 },
      animated: true
    });
  };

  handleDriveLocationChange = driverLocation => {
    this.setState({ driverLocation });
  };

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
    const { socket } = this;
    this.setState({ findingDriver: true });
    const { ridePlaceIds, findingDriver } = this.state;
    if (ridePlaceIds) {
      socket.emit("requestRide", ridePlaceIds);
    }
  };

  render() {
    const { polylineToDestination, findingDriver, driverLocation } = this.state;
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
              <Route coordinates={polylineToDestination} />
              <Marker
                coordinate={
                  polylineToDestination[polylineToDestination.length - 1]
                }
              />
            </Fragment>
          )}
          {driverLocation && <DriverMarker coordinate={driverLocation} />}
        </MapView>
        <DestinationSearch
          userLocation={userLocation}
          onDestinationSelect={this.handleDestinationSelect}
        />
        {polylineToDestination.length > 0 && (
          <MapAction>
            <Button
              onPress={this.requestDriver}
              label={!findingDriver ? "Request Ride" : "Finding Driver"}
            >
              {findingDriver && (
                <Loader style={styles.indicator} animating={findingDriver} />
              )}
            </Button>
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
  },
  indicator: {
    marginLeft: THEME.spacing.sm
  }
});

export default withLocation(Passenger);
