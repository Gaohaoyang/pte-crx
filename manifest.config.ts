import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  icons: {
    '16': 'images/16.png',
    '32': 'images/32.png',
    '48': 'images/48.png',
    '128': 'images/128.png',
  },
  name:
    env.mode === 'staging'
      ? '[INTERNAL] PTE Sub-Scores Breakdown'
      : 'PTE Sub-Scores Breakdown',
  description:
    'PTE Sub-Scores Breakdown. Visit your PTE score page, and you will see displaying your sub-scores, equivalent IELTS scores and more.',
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  action: { default_popup: 'index.html' },
  content_scripts: [
    {
      js: ['src/content.tsx'],
      matches: ['https://mypte.pearsonpte.com/*'],
      run_at: 'document_start',
      all_frames: true,
    },
  ],
  permissions: ['tabs'],
  web_accessible_resources: [
    // {
    //   resources: ['DonationList.html'],
    //   matches: ['<all_urls>'],
    // },
    {
      resources: ['injected.js'],
      matches: ['https://mypte.pearsonpte.com/*'],
    },
  ],
}))
