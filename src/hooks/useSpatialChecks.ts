import * as turf from '@turf/turf';
import type {MapFeature} from '../types';

export const useSpatialChecks = () => {

    // Check if New Feature is completely inside any Existing Feature
    const isContained = (newFeature: any, existingFeatures: MapFeature[]) => {
        return existingFeatures.some((existing) => {
            // Skip non-polygons (Lines don't contain things)
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

    // Auto-trim logic: Returns 'Clean' geometry or null if fully consumed
    const getTrimmedGeometry = (newFeature: any, existingFeatures: MapFeature[]) => {
        let currentGeometry = newFeature;

        for (const existing of existingFeatures) {
            // Skip lines, they don't clip polygons
            if (existing.geometry.type !== 'Polygon' && existing.geometry.type !== 'MultiPolygon') continue;

            try {
                // TURF v7 FIX: Use featureCollection for intersect
                const intersection = turf.intersect(turf.featureCollection([currentGeometry, existing as any]));

                if (intersection) {
                    // TURF v7 FIX: Use featureCollection for difference
                    // Logic: NewShape - ExistingShape
                    const diff = turf.difference(turf.featureCollection([currentGeometry, existing as any]));

                    if (!diff) return null; // Fully overlapped/consumed
                    currentGeometry = diff;
                }
            } catch (error) {
                console.error("Spatial operation failed:", error);
                // If crash happens during calc, return null to be safe (prevent invalid shapes)
                return null;
            }
        }
        return currentGeometry;
    };

    return { isContained, getTrimmedGeometry };
};