import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      hashtags: this.store.find('hashtag'),
      stories: this.store.find('story')
    });
  },
  renderTemplate: function(controller, model){
    this.render(); // render application template
    this.render('stories.all',{
     into: 'application',
     outlet: 'body'
     });
    this.render('hashtags.index',{
     into: 'application',
     outlet: 'sidebar'
     });
 }
});
