
// MIERUNE MONO読み込み
const map = new mapboxgl.Map({
    container: "map",
    style: {
        "version": 8,
        "sources": {
            "MIERUNEMAP": {
                "type": "raster",
                "tiles": ["https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png"],
                "tileSize": 256,
                "attribution": "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
            }
        },
        "layers": [{
            "id": "MIERUNEMAP",
            "type": "raster",
            "source": "MIERUNEMAP",
            "minzoom": 0,
            "maxzoom": 18
        }]
    },
    center: [139.767, 35.681],
    zoom: 11
});

// コントロール関係表示
map.addControl(new mapboxgl.NavigationControl());
