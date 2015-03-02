import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('hashtag', params.hashtag_id);
  },
  renderTemplate: function() {
    this.render({outlet: 'body'});
  }
});
