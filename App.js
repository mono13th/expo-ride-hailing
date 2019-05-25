import React, { Fragment } from "react";
import { StyleSheet, Button, View } from "react-native";

/**
 * Ignore socket warning
 */
console.ignoredYellowBox = ["Remote debugger"];
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);

import Driver from "./src/screens/Driver";
import Passenger from "./src/screens/Passenger";

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
        <Button title="Driver" onPress={this.setDriverContext} />
        <Button title="Passenger" onPress={this.setPassengerContext} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50
  }
});

export default App;
