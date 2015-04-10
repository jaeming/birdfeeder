import DS from 'ember-data';
import Ember from 'ember';

export default DS.ActiveModelAdapter.extend({
    // coalesceFindRequests: true,
    namespace: 'api',
    headers: {
      "X-CSRF-Token": Ember.$('meta[name="csrf-token"]').attr('content')
    }
});
