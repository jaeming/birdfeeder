import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      hashtags: this.store.find('hashtag', { subscribed: true }),
    });
  },
  setupController: function(controller, modelHash) {
    controller.set('hashtags', modelHash.hashtags);
  },
  renderTemplate: function(){
    this.render(); // render application template
    this.render('hashtags.subscribed',{
      into: 'application',
      outlet: 'sidebar',
      controller: 'application'
    });
  },
  afterModel: function(){
    this.store.find('story', { all: true });
  },
  actions: {
    loading: function() {
      var self = this;
      this.controllerFor('application').set('loadBar', true);
      Ember.run.later( function() {
        self.controllerFor('application').set('loadBar', false);
      }, 1200);

      return true;
    }
  }
});
