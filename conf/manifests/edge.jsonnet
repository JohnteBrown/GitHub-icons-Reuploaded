local common = import 'common.jsonnet';

common + {
  background: {
    service_worker: 'background.js',
  },
}
