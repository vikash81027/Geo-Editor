import type {MapFeature} from "../types";

const STORAGE_KEY = 'geo-editor-data';

export const saveFeaturesToStorage = (features: MapFeature[]) => {
    try {
        const data = JSON.stringify(features);
        localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
        console.error("Storage Save Error", error);
    }
};

export const loadFeaturesFromStorage = (): MapFeature[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Storage Load Error", error);
        return [];
    }
};