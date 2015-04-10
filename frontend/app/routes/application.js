import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    // this.controllerFor('application').set('isSpinning', true);
  },
  model: function() {
    return Ember.RSVP.hash({
      hashtags: this.store.find('hashtag', { subscribed: true }),
      stories: this.store.find('story', { subscribed: true })
    });
  },
  afterModel: function() {
    // this.controllerFor('application').set('isSpinning', false);
  },
  setupController: function(controller, modelHash) {
    controller.set('stories', modelHash.stories);
    controller.set('hashtags', modelHash.hashtags);
  },
  renderTemplate: function(){
    this.render(); // render application template
    this.render('stories.subscribed',{
      into: 'application',
      outlet: 'body'
    });
    this.render('hashtags.subscribed',{
      into: 'application',
      outlet: 'sidebar'
    });
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
