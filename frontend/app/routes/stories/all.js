import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('story');
  },
  renderTemplate: function() {
    this.render('stories.all',{
     into: 'application',
     outlet: 'body',
     });
  }
});
