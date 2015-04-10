import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('hashtag');
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('loadingVisible', false);
    controller.set('categories', false);
    controller.set('browseAll', false);
  },
  renderTemplate: function() {
    this.render({outlet: 'body',
    controller: 'feeds/customize'
    });
  }
});
