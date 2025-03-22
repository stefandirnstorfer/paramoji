/**
 * Converts an array of points to a smooth SVG path d attribute using cubic Bezier curves
 * @param {Array<{x: number, y: number}>} points - Array of point objects with x and y coordinates
 * @return {string} SVG path d attribute string
 */
import fs from 'fs';

export function pointsToSmoothSvgPath(points) {
  for (let i of [1,2,3])
    points = smoothPoints(points)

  if (!points || points.length === 0) {
    return '';
  }

  if (points.length === 1) {
    // Just a single point - create a small circle for visibility
    const { x, y } = points[0];
    return `M ${x},${y}`;
  }

  if (points.length === 2) {
    // Just a line between two points
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }

  // Start with a move command to the first point
  let pathData = `M ${points[0].x},${points[0].y}`;

  // For 3 or more points, use cubic bezier curves for smoothing
  for (let i = 1; i < points.length; i++) {
    // Calculate control points
    const curr = points[i];
    const prev = points[i - 1];

    if (i === 1) {
      // First segment uses the first point and the next point
      // to determine the control point direction
      const next = points[i + 1] || curr;

      // Calculate control point using the direction from prev to next
      const controlX = prev.x + (curr.x - prev.x) / 2;
      const controlY = prev.y + (curr.y - prev.y) / 2;

      pathData += ` C ${controlX},${controlY} ${curr.x},${curr.y} ${curr.x},${curr.y}`;
    }
    else if (i === points.length - 1) {
      // Last segment
      const beforePrev = points[i - 2];

      // Calculate the control point based on the curvature from the previous segment
      const dx = curr.x - beforePrev.x;
      const dy = curr.y - beforePrev.y;

      const controlX = prev.x + dx / 4;
      const controlY = prev.y + dy / 4;

      pathData += ` C ${controlX},${controlY} ${curr.x},${curr.y} ${curr.x},${curr.y}`;
    }
    else {
      // Middle segments - use surrounding points to create smooth curve
      const next = points[i + 1];

      // Calculate control points for smooth transition
      const controlX1 = prev.x + (curr.x - prev.x) / 2;
      const controlY1 = prev.y + (curr.y - prev.y) / 2;

      const controlX2 = curr.x - (next.x - prev.x) / 4;
      const controlY2 = curr.y - (next.y - prev.y) / 4;

      pathData += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${curr.x},${curr.y}`;
    }
  }

  return pathData;
}

export function pngToDataUrl(filePath) {

  // Read the file as a buffer
  const fileData = fs.readFileSync(filePath);

  // Convert buffer to base64
  const base64Data = fileData.toString('base64');

  // Create the data URL
  const dataUrl = `data:image/png;base64,${base64Data}`;

  return dataUrl;
}

function smoothPoints(points) {
  if (points.length <= 2) {
      // If there are 2 or fewer points, no smoothing is needed
      return points;
  }

  // Create a new array to store the smoothed points
  const smoothedPoints = [...points];

  for (let i = 1; i < points.length - 1; i++) {
      const prevPoint = points[i - 1];
      const currPoint = points[i];
      const nextPoint = points[i + 1];

      // Calculate the average of the neighboring points
      const avgX = (prevPoint.x + currPoint.x + nextPoint.x) / 3;
      const avgY = (prevPoint.y + currPoint.y + nextPoint.y) / 3;

      // Replace the current point with the average
      smoothedPoints[i] = { x: avgX, y: avgY };
  }

  return smoothedPoints;
}