# Tile fixtures

`tiles/{z}/{x}/{y}.png` contains the 24 map tiles for the default Tokyo view. The map
zoom is 11, but MapLibre requests 256 px raster tiles one level deeper, so the
fixtures are zoom 12 tiles.
The tests serve these files locally so screenshots do not depend on the network.
Requests without a saved tile use `fallback.png`.

Every request is validated before the fixture response: the whole URL must be
`https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png`, with non-negative
safe integers and `x < 2 ** z`, `y < 2 ** z` for Web Mercator. A request that
fails the check is aborted instead of answered, and the test lists it. Any
other request that leaves the preview server is aborted and fails the test;
the inline style in `src/main.ts` loads no sprite or glyphs.
MapLibre draws raster tiles into WebGL textures, so the tests cannot observe the
tile images themselves. Instead `src/main.ts` exposes the map as `window.maplibreMap`,
and `e2e/_helpers.ts` listens to the map's `idle` event (every requested tile
loaded and faded in, no camera movement) and `error` event (a failed tile load).
Both smoke and visual tests wait for `idle` with `areTilesLoaded()` true, and
any `error` event, page error or console error fails the test.

## Update map tiles

When the map center, zoom, or viewport changes:

1. Temporarily add `console.log(url)` after the tile URL is read in
   `stabilizeTileRequests` in `e2e/_helpers.ts`.
2. Run `pnpm run test:visual:update` to list the requested tile URLs.
3. Download each tile to the matching path and remove the temporary log. For
   example:

```sh
mkdir -p e2e/fixtures/tiles/11/1816
curl -fL 'https://tile.mierune.co.jp/mierune_mono/11/1816/805.png' \
  -o e2e/fixtures/tiles/11/1816/805.png
```

Run the visual tests again and check the screenshots after updating the tiles.

## Create the fallback tile

`fallback.png` is a 256×256 PNG with a `#eeeeee` background, 1 px `#e0e0e0`
grid lines every 64 px, and a 1 px `#c8c8c8` border along the top and left edges.
To recreate it with ImageMagick, run this from the repository root:

```sh
magick -size 256x256 xc:'#eeeeee' -fill '#e0e0e0' \
  -draw 'line 64,0 64,255 line 128,0 128,255 line 192,0 192,255 line 0,64 255,64 line 0,128 255,128 line 0,192 255,192' \
  -fill '#c8c8c8' -draw 'line 0,0 255,0 line 0,0 0,255' \
  e2e/fixtures/fallback.png
```
