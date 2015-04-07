import Ember from 'ember';

export default Ember.Route.extend({
  // beforeModel: function() {
  //   this.transitionTo('stories.subscribed');
  // },
  model: function() {
    return Ember.RSVP.hash({
      hashtags: this.store.find('hashtag', { subscribed: true }),
      stories: this.store.find('story', { subscribed: true })
    });
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
  }
});
