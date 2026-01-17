import React from 'react';

interface ToolbarProps {
    featureCount: number;
    onExport: () => void;
    onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ featureCount, onExport, onClear }) => {
    return (
        <div style={{
            height: '60px', 
            padding: '0 20px',
            background: '#1a1a1a', 
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #333',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 1000 
        }}>
            {/* Left Side: Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🗺️</span>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                    GeoArchitect <span style={{ color: '#4CAF50' }}>Pro</span>
                </h2>
            </div>

            {/* Right Side: Controls */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{
                    background: '#333',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                }}>
                    Active Shapes: <strong style={{ color: '#4CAF50' }}>{featureCount}</strong>
                </div>

                <button
                    onClick={onClear}
                    style={{
                        padding: '8px 16px',
                        background: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'background 0.2s'
                    }}>
                    Clear All
                </button>

                <button
                    onClick={onExport}
                    style={{
                        padding: '8px 16px',
                        background: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                    Export JSON ⬇
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
