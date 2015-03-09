import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('hashtag');
  },
  renderTemplate: function() {
    this.render({outlet: 'body',
    controller: 'feeds/customize'
    });
  }
});
