import * as turf from '@turf/turf';
import type {MapFeature} from '../types';

export const useSpatialChecks = () => {

    const isContained = (newFeature: any, existingFeatures: MapFeature[]) => {
        return existingFeatures.some((existing) => {
            if (existing.geometry.type === 'LineString' || existing.geometry.type === 'Point') return false;
            if (newFeature.geometry.type !== 'Polygon' && newFeature.geometry.type !== 'MultiPolygon') return false;

            try {
                return turf.booleanContains(existing as any, newFeature);
            } catch (e) {
                console.warn("Containment check failed", e);
                return false;
            }
        });
    };
    const getTrimmedGeometry = (newFeature: any, existingFeatures: MapFeature[]) => {
        let currentGeometry = newFeature;

        for (const existing of existingFeatures) {
            if (existing.geometry.type !== 'Polygon' && existing.geometry.type !== 'MultiPolygon') continue;

            try {
                const intersection = turf.intersect(turf.featureCollection([currentGeometry, existing as any]));

                if (intersection) {
                    const diff = turf.difference(turf.featureCollection([currentGeometry, existing as any]));

                    if (!diff) return null; 
                    currentGeometry = diff;
                }
            } catch (error) {
                console.error("Spatial operation failed:", error);
                return null;
            }
        }
        return currentGeometry;
    };

    return { isContained, getTrimmedGeometry };
};
