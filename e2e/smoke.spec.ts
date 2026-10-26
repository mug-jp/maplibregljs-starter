import {
    test,
    expect,
    stabilizeTileRequests,
    waitForMapReady,
    resetMapReady,
    expectValidTileRequests,
    tileLevel,
    MAP_READY_TIMEOUT_MS,
} from './_helpers';

test('smoke: MapLibre renders loaded tiles', async ({ page, baseURL }) => {
    const tileUrls = await stabilizeTileRequests(page);

    // './' keeps the project path of the subpath project; '/' would leave it.
    await page.goto('./');
    const map = page.locator('#map');
    await expect(map).toBeVisible();

    // MapLibre adds its WebGL canvas to #map when the Map is constructed.
    await expect(page.locator('#map canvas.maplibregl-canvas')).toBeVisible({
        timeout: MAP_READY_TIMEOUT_MS,
    });

    await waitForMapReady(page);
    await expectValidTileRequests(tileUrls);

    // v6 loads its worker from a file that Vite emits under the base path. vite
    // preview answers a missing file with index.html (HTTP 200), so check the
    // type as well as the status.
    await expect
        .poll(() => page.workers().length, { message: 'expected MapLibre to start a worker' })
        .toBeGreaterThan(0);
    for (const worker of page.workers()) {
        const url = worker.url();
        expect(url.startsWith(`${baseURL}assets/`), `worker URL under the app base: ${url}`).toBe(
            true
        );
        const response = await page.request.get(url);
        expect(response.status(), url).toBe(200);
        expect(response.headers()['content-type'], url).toContain('javascript');
    }

    // NavigationControl and the attribution belong to the rendered page.
    await expect(page.locator('.maplibregl-ctrl-zoom-in')).toBeVisible();
    await expect(page.locator('.maplibregl-ctrl-attrib')).toContainText('MIERUNE');

    // Zooming in requests the next level and ends in another idle state.
    await resetMapReady(page);
    await page.locator('.maplibregl-ctrl-zoom-in').click();
    await waitForMapReady(page);
    expect(await page.evaluate(() => window.maplibreMap?.getZoom())).toBeCloseTo(12);
});

test('smoke: the tile URL check rejects anything but a valid MIERUNE tile', async () => {
    expect(tileLevel('https://tile.mierune.co.jp/mierune_mono/12/3637/1612.png')).toBe(12);
    for (const url of [
        // Wrong host, wrong path prefix, unexpanded template, out of range.
        'https://example.com/mierune_mono/12/3637/1612.png',
        'https://tile.mierune.co.jp/other/mierune_mono/12/3637/1612.png',
        'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
        'https://tile.mierune.co.jp/mierune_mono/12/4096/1612.png',
        'https://tile.mierune.co.jp/mierune_mono/12/3637/4096.png',
    ]) {
        expect(tileLevel(url), url).toBe(-1);
    }
});
