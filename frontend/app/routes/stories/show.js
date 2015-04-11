import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('story', params.id);
  },
  renderTemplate: function() {
    this.render({outlet: 'body'});
  },
});
