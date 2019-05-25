import PolyLine from "@mapbox/polyline";

export const buildRoutePolyline = route => {
  const points = PolyLine.decode(route.routes[0].overview_polyline.points);
  const pointCoords = points.map(point => {
    return {
      latitude: point[0],
      longitude: point[1]
    };
  });
  return pointCoords;
};
