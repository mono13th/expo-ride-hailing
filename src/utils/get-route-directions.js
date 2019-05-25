import { DIRECTIONS_BASE_URL } from "../constants";

export const getRouteDirections = async (start, end) => {
  const url = `${DIRECTIONS_BASE_URL}&origin=${start}&destination=${end}`;
  try {
    const result = await fetch(url);
    const res = await result.json();
    return res;
  } catch (err) {
    // TODO: Handle fetch issue
  }
};
