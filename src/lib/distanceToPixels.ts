import { Map } from "leaflet";
import LeafletGeometry from "leaflet-geometryutil";

export function distanceToPixel(
  distanceMeters: number,
  map: Map,
  zoom: number
) {
  var l2 = LeafletGeometry.destination(map.getCenter(), 90, distanceMeters);
  var p1 = map.project(map.getCenter(), zoom);
  var p2 = map.project(l2, zoom);
  return p1.distanceTo(p2);
}
