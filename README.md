# 🗺️ React Geospatial Editor

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Build-Vite-yellow?logo=vite)
![Leaflet](https://img.shields.io/badge/Map-Leaflet-green?logo=leaflet)
![Turf.js](https://img.shields.io/badge/Spatial-Turf.js-orange)

**React Geospatial Editor** is a robust, production-ready mapping application built to handle complex spatial geometries. It features a custom logic engine that automatically validates shapes to prevent invalid overlaps and strictly enforces containment rules. Designed for developers and GIS professionals who need a reliable tool for creating and exporting clean GeoJSON data.

---

## 🚀 Key Features

### 1. Advanced Drawing Suite
- **Polygons & Lines:** Precise point-to-point drawing.
- **Rectangles & Circles:** Intuitive "Click & Drag" creation interactions.
- **Smart Conversions:** Circles are automatically converted to approximated Polygons (64 segments) to ensure consistency across GeoJSON standards.

### 2. Intelligent Spatial Logic (Turf.js Powered)
- **Auto-Trim (Overlap Prevention):** If a new shape partially overlaps an existing one, the engine automatically calculates the difference and trims the new shape to fit the available space.
- **Anti-Containment System:** Prevents the creation of shapes that are completely inside another existing shape.
- **Conflict Resolution:** Visual feedback and automatic removal of invalid "ghost" shapes.

### 3. Data Management
- **GeoJSON Export:** One-click export functionality to download your map state as a standard `.json` file.
- **Local Persistence:** Your work is automatically saved to the browser's LocalStorage, preventing data loss on refresh.
- **Shape Limits:** Configurable constraints on the number of shapes per type (e.g., max 5 Polygons).

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 (with Hooks)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Mapping Library:** Leaflet & React-Leaflet
- **Drawing Plugin:** Leaflet-Draw
- **Spatial Analysis:** Turf.js (v7)
- **Styling:** CSS Modules & Standard Leaflet CSS

---

## ⚡ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/react-geo-editor.git](https://github.com/your-username/react-geo-editor.git)
   cd react-geo-editor
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   The application will typically start at `http://localhost:5173`.

### Building for Production

To create an optimized build for deployment:
```bash
npm run build
```

---

## 📖 User Guide

### How to Draw
| Shape Type | Interaction Method |
|------------|--------------------|
| **Polygon** | Click on the map to place points. Click the first point again (or double-click) to close the shape. |
| **Rectangle** | Click the button, then **click and drag** on the map to define the area. Release to finish. |
| **Circle** | Click the button, then **click and drag** from the center outward to define the radius. Release to finish. |
| **LineString** | Click to create a path of lines. Double-click to end the line. |

### Spatial Rules (The "Logic")
1. **The Overlap Rule:** You cannot place a shape on top of another. If you try, the new shape will be cut (trimmed) so it only occupies the free space.
2. **The Inside Rule:** You cannot place a smaller shape completely inside a larger one. The action will be blocked.

### Exporting Data
- Locate the **"Export JSON"** button in the top toolbar.
- Clicking it will download a file named `map-data.json`.
- This file contains a standard `FeatureCollection` compatible with QGIS, ArcGIS, or Google Earth.

---

## ⚙️ Configuration

You can adjust the application limits in the constants file (usually found in `src/constants.ts` or at the top of the main component):

```typescript
export const LIMITS = {
  Polygon: 5,     // Max number of polygons allowed
  Rectangle: 5,   // Max number of rectangles allowed
  Circle: 5,      // Max number of circles allowed
  LineString: 10  // Max number of lines allowed
};
```

---

## 🐛 Troubleshooting & Nuances

- **React Strict Mode:** This project intentionally disables `<React.StrictMode>` in `main.tsx`. This is required to prevent conflict issues with the `leaflet-draw` library which can cause double-rendering of drawing handlers.
- **Turf.js Version:** Ensure you are using Turf.js v7+. This project uses `turf.difference(featureCollection)`, which is a syntax specific to the newer versions of the library.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any features or bug fixes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request