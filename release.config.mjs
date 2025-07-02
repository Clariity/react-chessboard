const config = {
  branches: ['main', { name: 'beta', prerelease: true }],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    [
      '@semantic-release/release-notes-generator',
      { preset: 'conventionalcommits' },
    ],
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
};

export default config;
