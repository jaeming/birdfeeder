import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(posts, transition) {
    this.transitionTo('stories.all');
  },
  model: function() {
    return Ember.RSVP.hash({
      user: this.store.find('user', 'default_user'),
      stories: this.store.find('story', { subscribed: true })
    });
  },
  setupController: function(controller, modelHash) {
    controller.set('stories', modelHash.stories);
    controller.set('defaultUser', modelHash.user);
  },
  renderTemplate: function(){
    this.render(); // render application template
    this.render('stories.all',{
     into: 'application',
     outlet: 'body'
     });
    this.render('users.subscribed',{
     into: 'application',
     outlet: 'sidebar'
     });
  }
});
