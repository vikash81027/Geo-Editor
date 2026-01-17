import React from 'react';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Component Imports
import { useGeoEditor } from '../../hooks/useGeoEditor';
import { getFeatureStyle } from './LayerStyles';
import Toolbar from './Toolbar';
import Toast from '../UI/Toast';

// Fix Leaflet Icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🟢 FIX: Configuration Object Outside Component (Static)
// Taaki re-render hone par Drawing Tool reset na ho
const DRAW_CONFIG = {
    rectangle: { shapeOptions: { color: '#2196F3' } }, // Blue preview
    polygon: { shapeOptions: { color: '#FF5722' } },   // Orange preview
    circle: { shapeOptions: { color: '#9C27B0' } },    // Purple preview
    polyline: { shapeOptions: { color: '#333' } },
    circlemarker: false,
    marker: false,
};

const MapEditor: React.FC = () => {
    const {
        features,
        toast,
        closeToast,
        handleCreated,
        deleteFeature,
        clearAll,
        exportGeoJSON
    } = useGeoEditor();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>

            <Toolbar
                featureCount={features.length}
                onExport={exportGeoJSON}
                onClear={clearAll}
            />

            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    <FeatureGroup>
                        <EditControl
                            position="topright"
                            onCreated={handleCreated}
                            draw={DRAW_CONFIG} // 🟢 FIX: Passing static config
                            edit={{ edit: false, remove: false }}
                        />
                    </FeatureGroup>

                    {/* Render Saved Features */}
                    {features.map((feature) => (
                        <GeoJSON
                            key={feature.id}
                            data={feature}
                            style={() => getFeatureStyle(feature.properties.shapeType)}
                            onEachFeature={(feature, layer) => {
                                const f = feature as import('../../types').MapFeature;
                                layer.bindPopup(`
                    <div style="font-family: sans-serif; min-width: 150px;">
                      <h4 style="margin:0 0 5px 0;">${f.properties.shapeType}</h4>
                      <small>ID: ${f.id.substring(0,8)}...</small><br/>
                      <button 
                        id="del-btn-${f.id}" 
                        style="width:100%; margin-top:8px; background:#ff4444; color:white; border:none; padding:6px; border-radius:4px; cursor:pointer;">
                        Delete Shape
                      </button>
                    </div>
                  `);
                                layer.on('popupopen', () => {
                                    const btn = document.getElementById(`del-btn-${f.id}`);
                                    if(btn) btn.onclick = () => {
                                        layer.closePopup();
                                        deleteFeature(f.id);
                                    };
                                });
                            }}
                        />
                    ))}
                </MapContainer>
            </div>

            <Toast toast={toast} onClose={closeToast} />
        </div>
    );
};

export default MapEditor;