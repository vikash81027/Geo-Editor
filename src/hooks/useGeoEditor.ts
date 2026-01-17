import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as turf from '@turf/turf';
import type {MapFeature, ToastState} from '../types';
import { LIMITS } from '../config/limits';
import { useSpatialChecks } from './useSpatialChecks';
import { saveFeaturesToStorage, loadFeaturesFromStorage } from '../utils/storage';
import { circleToPolygon } from '../utils/geoUtils';

export const useGeoEditor = () => {
    const [features, setFeatures] = useState<MapFeature[]>(() => loadFeaturesFromStorage());
    const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', visible: false });

    const { isContained, getTrimmedGeometry } = useSpatialChecks();

    useEffect(() => {
        saveFeaturesToStorage(features);
    }, [features]);

    const showToast = (message: string, type: 'error' | 'success' | 'info') => {
        setToast({ message, type, visible: true });
    };

    const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

    // Helper: Type name fix
    const normalizeType = (type: string) => {
        if (type === 'rectangle') return 'Rectangle';
        if (type === 'polygon') return 'Polygon';
        if (type === 'circle') return 'Circle';
        if (type === 'polyline') return 'LineString';
        return type;
    };

    const handleCreated = (e: any) => {
        const layer = e.layer;
        const rawType = e.layerType;

        console.log("---- DRAW EVENT STARTED ----");
        console.log("Raw Type:", rawType);

        try {
            let newGeoJSON = layer.toGeoJSON();

            if (rawType === 'circle') {
                const center = [layer.getLatLng().lng, layer.getLatLng().lat] as [number, number];
                const radius = layer.getRadius();
                newGeoJSON = circleToPolygon(center, radius);
                newGeoJSON.properties = { ...newGeoJSON.properties, radius };
            }
            const assignedType = normalizeType(rawType);
            const shapeId = uuidv4();

            newGeoJSON.id = shapeId;
            newGeoJSON.properties = {
                ...newGeoJSON.properties,
                shapeType: assignedType,
                createdAt: Date.now(),
            };

            console.log("Processed GeoJSON:", newGeoJSON);

            const currentCount = features.filter(f => f.properties.shapeType === assignedType).length;
            const maxLimit = LIMITS[assignedType as keyof typeof LIMITS];

            if (maxLimit !== undefined && currentCount >= maxLimit) {
                showToast(`Limit reached for ${assignedType}!`, 'error');
                layer.remove(); 
                return;
            }
            if (features.length > 0 && (newGeoJSON.geometry.type === 'Polygon' || newGeoJSON.geometry.type === 'MultiPolygon')) {

                console.log("Running Spatial Checks...");

                if (isContained(newGeoJSON, features)) {
                    showToast(`Blocked: Shape is fully inside another!`, 'error');
                    layer.remove(); 
                    return;
                }

                const trimmed = getTrimmedGeometry(newGeoJSON, features);

                if (!trimmed) {
                    showToast(`Blocked: Shape fully overlaps existing area.`, 'error');
                    layer.remove(); 
                    return;
                }
                newGeoJSON.geometry = trimmed.geometry;
            }
            console.log("Saving Shape to State...");
            setFeatures(prev => [...prev, newGeoJSON as MapFeature]);

            setTimeout(() => layer.remove(), 0);

        } catch (error) {
            console.error("CRITICAL ERROR in handleCreated:", error);
            showToast("System Error: Could not save shape.", 'error');
        }
    };

    const deleteFeature = (id: string) => {
        setFeatures(prev => prev.filter(f => f.id !== id));
        showToast("Shape deleted", 'info');
    };

    const clearAll = () => {
        if(confirm("Delete all shapes?")) {
            setFeatures([]);
            showToast("Map cleared", 'error');
        }
    };

    const exportGeoJSON = () => {
        const collection = turf.featureCollection(features);
        const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'geo-data.json';
        a.click();
        showToast("GeoJSON Exported!", 'success');
    };

    return { features, toast, closeToast, handleCreated, deleteFeature, clearAll, exportGeoJSON };
};
