import * as turf from '@turf/turf';
import type { Feature, Polygon, GeoJsonProperties } from 'geojson';

export const circleToPolygon = (center: [number, number], radiusInMeters: number): Feature<Polygon, GeoJsonProperties> => {
    const radiusInKm = radiusInMeters / 1000;
    const options = { steps: 64, units: 'kilometers' as const };
    return turf.circle(center, radiusInKm, options);
};

export const calculateArea = (feature: Feature<any>): string => {
    if (feature.geometry.type === 'LineString') return 'N/A';
    const area = turf.area(feature);
    return `${(area / 1000000).toFixed(2)} km²`;
};
