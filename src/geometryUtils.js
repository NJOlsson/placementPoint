function onLine(l1, p) {
    if (p.x <= Math.max(l1.p1.x, l1.p2.x)
        && p.x <= Math.min(l1.p1.x, l1.p2.x)
        && (p.y <= Math.max(l1.p1.y, l1.p2.y)
            && p.y <= Math.min(l1.p1.y, l1.p2.y)))
        return true;

    return false;
}

function direction(a, b, c) {
    let val = (b.y - a.y) * (c.x - b.x)
        - (b.x - a.x) * (c.y - b.y);

    if (val == 0)

        return 0;

    else if (val < 0)

        return 2;

    return 1;
}

function intersects(l1, l2) {
    let dir1 = direction(l1.p1, l1.p2, l2.p1);
    let dir2 = direction(l1.p1, l1.p2, l2.p2);
    let dir3 = direction(l2.p1, l2.p2, l1.p1);
    let dir4 = direction(l2.p1, l2.p2, l1.p2);

    if (dir1 != dir2 && dir3 != dir4)
        return true;

    if (dir1 == 0 && onLine(l1, l2.p1))
        return true;

    if (dir2 == 0 && onLine(l1, l2.p2))
        return true;

    if (dir3 == 0 && onLine(l2, l1.p1))
        return true;

    if (dir4 == 0 && onLine(l2, l1.p2))
        return true;

    return false;
}

export function pointIsInsidePolygon(point, polygon) {
    var pointLine = { p1: point, p2: { x: point.x + 9999, y: point.y } }
    var lineCrossings = polygon.polylines
        .flatMap(function (polyline) { return polyline.lineSegments; })
        .reduce(function (accumulator, lineSegment) { return (intersects(lineSegment, pointLine) ? 1 : 0) + accumulator; }, 0);

    return lineCrossings % 2 !== 0;
}

export function pointDistanceToPolygon(point, polygon) {
    var distances = polygon.polylines
        .flatMap(function (polyline) { return polyline.lineSegments; })
        .map(function (lineSegment) { return pointDistanceToSegment(point, lineSegment.p1, lineSegment.p2) });

    return Math.min(...distances);
}

function pointDistanceToSegment(point, lineStart, lineEnd) {
    return Math.sqrt(distanceToSegmentSquared(point, lineStart, lineEnd));
}

function distanceToSegmentSquared(point, lineStart, lineEnd) {
    var lineDistSqr = distSqr(lineStart, lineEnd);

    if (lineDistSqr === 0)
        return distSqr(point, lineStart);

    var t = ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) + (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) / lineDistSqr;

    if (t > 1)
        return distSqr(point, lineEnd);

    if (t < 0)
        return distSqr(point, lineStart);

    var orthogonalProjection = {
        x: lineStart.x + t * (lineEnd.x - lineStart.x),
        y: lineStart.y + t * (lineEnd.y - lineStart.y)
    };

    return distSqr(point, orthogonalProjection);
}
function distSqr(v, u) {
    return sqr(v.x - u.x) + sqr(v.y - u.y);
}
function sqr(x) {
    return x * x;
}
