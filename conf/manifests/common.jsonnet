local hostMatches = [
  '*://bitbucket.org/*',
  '*://github.com/*',
  '*://gist.github.com/*',
  '*://gitlab.com/*',
  '*://pastebin.com/*',
  '*://sourceforge.net/*',
];

{
  manifest_version: 3,
  name: 'GitHub VS Code Icons',
  description: 'Show VS Code icons for files and folders on supported code-hosting websites.',
  version: '2.0.3',
  action: {
    default_title: 'GitHub VS Code Icons',
    default_icon: {
      '16': 'icon16.png',
      '48': 'icon48.png',
      '128': 'icon128.png',
    },
    default_popup: 'popup.html',
  },
  content_scripts: [
    {
      matches: hostMatches,
      css: ['content.css'],
      js: ['content.js'],
      run_at: 'document_idle',
    },
  ],
  icons: {
    '16': 'icon16.png',
    '48': 'icon48.png',
    '128': 'icon128.png',
  },
  permissions: ['storage'],
  web_accessible_resources: [
    {
      matches: hostMatches,
      resources: [
        'icons/*.svg',
        'images/*.gif',
        'favicons/*.ico',
        'favicons/*.png',
      ],
    },
  ],
}
