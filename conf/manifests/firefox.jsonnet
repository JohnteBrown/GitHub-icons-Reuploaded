local common = import 'common.jsonnet';

common + {
  background: {
    scripts: ['background.js'],
  },
  browser_specific_settings: {
    gecko: {
      id: std.extVar('gecko_extension_id'),
      data_collection_permissions: {
        required: ['none'],
      },
    },
  },
}
