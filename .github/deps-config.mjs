// Dependency auto-update settings for this repository. The scripts under
// .github/scripts read this file; how to adopt the automation in another
// repository is described in .github/AUTOMATION.md.

// Packages that are updated and tested together, by package name. The keys
// name the groups in logs, Slack messages and the PR body. Packages not
// listed here are never updated by the workflow.
export const groups = {
    'maplibre-gl': ['maplibre-gl'],
    typescript: ['typescript'],
    vite: ['vite'],
};

// The project version takes this package's new version when that is higher
// than the current one; otherwise, and for any other update, a fourth
// segment is added (6.14.0 -> 6.14.0.1).
export const projectVersionFollows = 'maplibre-gl';

// Package name -> name shown as "<Name> v1.2.3" in README.md and, in this
// order, in the release notes.
export const displayNames = {
    'maplibre-gl': 'MapLibre GL JS',
    typescript: 'TypeScript',
    vite: 'Vite',
};
