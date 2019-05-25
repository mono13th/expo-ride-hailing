import React from "react";

export function withLocation(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userLocation: {
          latitude: 0,
          longitude: 0
        }
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

    render() {
      return (
        <WrappedComponent
          userLocation={this.state.userLocation}
          {...this.props}
        />
      );
    }
  };
}
