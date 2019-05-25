import React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableHighlight,
  Keyboard
} from "react-native";
import { debounce } from "lodash";

import { PLACES_SEARCH_BASE_URL } from "@constants";
import THEME from "@theme";
import Result from "./Result";

class DestinationSearch extends React.Component {
  state = {
    query: "",
    results: []
  };

  handleDestinationChange = async query => {
    this.setState({ query });
    this.fetchDestinations(query);
  };

  fetchDestinations = debounce(async query => {
    const { userLocation } = this.props;
    const { latitude, longitude } = userLocation;
    const url = `${PLACES_SEARCH_BASE_URL}&location=${latitude},${longitude}&input=${query}`;
    try {
      const result = await fetch(url);
      const res = await result.json();
      this.setState({ results: res.predictions });
    } catch (err) {
      // TODO: Handle fetch issue
    }
  }, 500);

  handlePlaceSelect = async (placeId, name) => {
    this.setState({ query: name, results: [] });
    this.props.onDestinationSelect(placeId);
    Keyboard.dismiss();
  };

  render() {
    const { query, results } = this.state;
    const predictions = results.map(prediction => {
      const { id, place_id, structured_formatting } = prediction;
      return (
        <TouchableHighlight
          onPress={() =>
            this.handlePlaceSelect(place_id, structured_formatting.main_text)
          }
          key={id}
        >
          <View>
            <Result>{structured_formatting.main_text}</Result>
          </View>
        </TouchableHighlight>
      );
    });
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Where would you like to go..."
          value={query}
          onChangeText={query => this.handleDestinationChange(query)}
          style={styles.input}
        />
        {predictions.length > 0 && (
          <View style={styles.results}>{predictions}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: THEME.spacing.xl,
    marginLeft: THEME.spacing.lg,
    marginRight: THEME.spacing.lg
  },
  input: {
    borderRadius: THEME.borders.radius,
    height: THEME.sizes.lg,
    backgroundColor: "#fff",
    paddingTop: THEME.spacing.xs,
    paddingBottom: THEME.spacing.xs,
    paddingLeft: THEME.spacing.md,
    paddingRight: THEME.spacing.md,
    elevation: THEME.shadow.elevation
  },
  results: {
    elevation: THEME.shadow.elevation,
    borderRadius: THEME.borders.radius,
    backgroundColor: "#fff",
    elevation: THEME.shadow.elevation,
    marginTop: THEME.spacing.sm
  }
});

export default DestinationSearch;
