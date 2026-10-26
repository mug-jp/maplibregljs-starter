import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'e2e',
    // Software WebGL rendering makes concurrent map tests compete for CPU.
    workers: process.env.CI ? 1 : undefined,
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : [['list']],
    // Snapshots live in one directory that .gitignore excludes — no baseline is
    // committed. .github/workflows/deps-autoupdate.yml regenerates the baseline
    // from pre-update main (--update-snapshots) before comparing.
    snapshotDir: '.playwright-snapshots',
    // Baselines are created only by an explicit --update-snapshots run.
    updateSnapshots: 'none',
    use: {
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        // Make renders more deterministic in CI.
        colorScheme: 'light',
        reducedMotion: 'reduce',
        // Kept in test-results/ for a failed test; CI uploads that directory.
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [
        { name: 'root', use: { baseURL: 'http://127.0.0.1:4173/' } },
        { name: 'subpath', use: { baseURL: 'http://127.0.0.1:4174/maplibregljs-starter/' } },
    ],
    // `vite preview` serves the existing dist/ build — run `pnpm run build`
    // first (as `pnpm test` does), or the tests hit a stale or missing build.
    // `pnpm test` builds with base / into dist/ and the root preview serves
    // that, so a VITE_BASE or VITE_OUTDIR in a local .env cannot change what
    // the tests check or write the build into docs/. The servers are never
    // reused and bind their ports strictly, so a run fails instead of testing
    // whatever another process serves on the port.
    webServer: [
        {
            command:
                'pnpm exec vite preview --base / --outDir dist --host 127.0.0.1 --port 4173 --strictPort',
            url: 'http://127.0.0.1:4173/',
            reuseExistingServer: false,
            timeout: 120_000,
        },
        {
            // Build separately with the Pages base for the subpath check.
            command:
                'pnpm exec vite build --base /maplibregljs-starter/ --outDir dist-subpath && pnpm exec vite preview --base /maplibregljs-starter/ --outDir dist-subpath --host 127.0.0.1 --port 4174 --strictPort',
            url: 'http://127.0.0.1:4174/maplibregljs-starter/',
            reuseExistingServer: false,
            timeout: 120_000,
        },
    ],
});
