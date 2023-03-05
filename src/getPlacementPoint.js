import { getPolygonBoundingBox } from './getViewBoxForPolygon.js';
import { pointIsInsidePolygon, pointDistanceToPolygon } from './geometryUtils.js'

export function getPlacementPoint(polygon) {
  var transformed = transform(polygon);
  var boundingBox = getPolygonBoundingBox(polygon);
  var minX = boundingBox.min[0];
  var maxX = boundingBox.max[0];
  var minY = boundingBox.min[1];
  var maxY = boundingBox.max[1];
  var width = maxX - minX;
  var height = maxY - minY;
  var centerPoint = { x: minX + width / 2, y: minY + height / 2 };
  var centerPointDistance = pointIsInsidePolygon(centerPoint, transformed) ? pointDistanceToPolygon(centerPoint, transformed) : 0;

  var bestPoint = getBestPlacement({ point: centerPoint, distance: centerPointDistance }, width, height, transformed, 20);

  return [bestPoint.point.x, bestPoint.point.y];
}

function getBestPlacement(centerPoint, width, height, polygon, split = 2, tolerance = 0.0001) {
  if (width < tolerance || height < tolerance) return centerPoint;
  var minX = centerPoint.point.x - width / 2;
  var maxX = centerPoint.point.x + width / 2;
  var minY = centerPoint.point.y - height / 2;
  var maxY = centerPoint.point.y + height / 2;
  var newWidth = width / split;
  var newHeight = height / split;
  var xh = newWidth / 2;
  var yh = newHeight / 2;

  var points = [];
  for (let x = minX; x < maxX; x += newWidth) {
    for (let y = minY; y < maxY; y += newHeight) {

      points.push({ x: x + xh, y: y + yh });
    }
  }

  var bestPoint = points.filter(function (point) { return pointIsInsidePolygon(point, polygon) })
    .reduce(function (accumulator, point) {
      var distance = pointDistanceToPolygon(point, polygon);
      if (distance > accumulator.distance) {
        return { distance: distance, point: point }
      } else {
        return accumulator;
      }
    }, centerPoint)

  if (bestPoint === centerPoint) {
    return centerPoint;
  }

  return getBestPlacement(bestPoint, newWidth, newHeight, polygon);
}

function transform(polygon) {
  const polygonOtherFormat = polygon.polylines
    .map((polyline) => {
      const polylinePoints = polyline.points
        .map((point) => ({ x: point[0], y: point[1] }))
      var polylineSegments = [];
      for (let i = 0; i < polylinePoints.length - 1; i++) {
        polylineSegments.push({ p1: polylinePoints[i], p2: polylinePoints[(i + 1) % polylinePoints.length] })
      }
      return { lineSegments: polylineSegments };
    })
  return { polylines: polygonOtherFormat };
}

