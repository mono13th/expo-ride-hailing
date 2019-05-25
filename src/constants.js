import { GOOGLE_API_KEY, SERVER_IP_ADDRESS } from "react-native-dotenv";

export const PLACES_SEARCH_BASE_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_API_KEY}`;
export const DIRECTIONS_BASE_URL = `https://maps.googleapis.com/maps/api/directions/json?key=${GOOGLE_API_KEY}`;
export const SOCKET_BASE_URL = `http://${SERVER_IP_ADDRESS}:3000`;
