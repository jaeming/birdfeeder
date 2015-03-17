import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      hashtags: this.store.find('hashtag'),
      stories: this.store.find('story')
    });
  },
  setupController: function(controller, modelHash) {
    controller.set('stories', modelHash.stories);
    controller.set('hashtags', modelHash.hashtags);
  },
  renderTemplate: function(){
    this.render(); // render application template
    this.render('stories.all',{
     into: 'application',
     outlet: 'body'
     });
    this.render('hashtags.index',{
     into: 'application',
     outlet: 'sidebar'
     });
  },
});
