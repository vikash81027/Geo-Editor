import type {Feature, Polygon, LineString, Point, MultiPolygon} from 'geojson';

export type GeoShapeType = 'Polygon' | 'Rectangle' | 'Circle' | 'LineString';

// Update: Added MultiPolygon to the allowed geometry types
export interface MapFeature extends Feature<Polygon | MultiPolygon | LineString | Point> {
    id: string;
    properties: {
        shapeType: GeoShapeType;
        createdAt: number;
        radius?: number;
    };
}

export interface ToastState {
    message: string;
    type: 'error' | 'success' | 'info';
    visible: boolean;
}