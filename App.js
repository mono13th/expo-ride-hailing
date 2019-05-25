import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight
} from "react-native";

/**
 * Ignore socket warning
 */
console.ignoredYellowBox = ["Remote debugger"];
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);

import THEME from "@theme";
import Driver from "@screens/Driver";
import Passenger from "@screens/Passenger";
import DriverIcon from "@assets/driver.png";
import PassengerIcon from "@assets/passenger.png";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: null
    };
  }

  setDriverContext = () => {
    this.setState({ context: "driver" });
  };

  setPassengerContext = () => {
    this.setState({ context: "passenger" });
  };

  render() {
    const { context } = this.state;
    if (context === "driver") {
      return <Driver />;
    }
    if (context === "passenger") {
      return <Passenger />;
    }
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this.setPassengerContext}
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            <Image source={PassengerIcon} />
            <Text style={styles.buttonLabel}>I am a Passenger</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.setDriverContext}
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            <Image source={DriverIcon} />
            <Text style={styles.buttonLabel}>I am a Driver</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: THEME.spacing.lg
  },
  button: {
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderRadius: THEME.borders.radius * 2,
    borderWidth: 2,
    borderColor: "#ccc",
    width: "100%",
    padding: THEME.spacing.lg
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  buttonLabel: {
    fontSize: 24,
    color: "#777",
    marginLeft: THEME.spacing.md
  }
});

export default App;
