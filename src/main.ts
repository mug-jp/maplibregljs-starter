import './style.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GPUInitializationError, Map, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);

try {
    const map = new Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                MIERUNEMAP: {
                    type: 'raster',
                    tiles: ['https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution:
                        "Maptiles by <a href='https://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='https://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL.",
                },
            },
            layers: [
                {
                    id: 'MIERUNEMAP',
                    type: 'raster',
                    source: 'MIERUNEMAP',
                    minzoom: 0,
                    maxzoom: 18,
                },
            ],
        },
        center: [139.767, 35.681],
        zoom: 11,
    });

    map.addControl(
        new NavigationControl({
            visualizePitch: true,
        })
    );

    window.maplibreMap = map;
} catch (error) {
    if (error instanceof GPUInitializationError) {
        const container = document.getElementById('map');
        if (container) {
            container.textContent =
                'MapLibre GL JS v6 requires WebGL2, which this browser could not initialize.';
        }
    }
    throw error;
}
