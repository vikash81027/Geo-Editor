import type { PathOptions } from 'leaflet';

export const getFeatureStyle = (shapeType: string): PathOptions => {
    switch (shapeType) {
        case 'Polygon':
            return { color: '#FF5722', weight: 2, fillOpacity: 0.4, dashArray: '5, 5' }; // Orange
        case 'Rectangle':
            return { color: '#2196F3', weight: 2, fillOpacity: 0.4 }; // Blue
        case 'Circle':
            return { color: '#9C27B0', weight: 2, fillOpacity: 0.3 }; // Purple
        case 'LineString':
            return { color: '#333', weight: 4 };
        default:
            return { color: '#666', weight: 1 };
    }
};