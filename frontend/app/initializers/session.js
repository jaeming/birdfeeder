export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');
}

import Ember from 'ember';

export default {
  name: 'session',
  initialize: function(container) {
    Ember.$.ajax({
      url: '/api/sessions/current',
      type: 'GET',
      dataType: "json",
      success:function(data) {
        container.lookup('controller:session').set('currentUser', {
          email: data['email'],
          name: data['name'],
          id: data['id'],
          avatar: data['avatar']
        });
      },
      error:function() {
        console.log('hola guest!');
      }
    });
  }
};
