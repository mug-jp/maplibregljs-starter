import type { Map } from 'maplibre-gl';

declare global {
    interface Window {
        // E2E tests use this reference; window.map is already the #map element.
        maplibreMap?: Map;
    }
}
