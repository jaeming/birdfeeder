import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    coalesceFindRequests: true,
    namespace: 'api',
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr('content')
    }
});