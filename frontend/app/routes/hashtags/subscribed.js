import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('hashtag', { subscribed: true });
  },
  renderTemplate: function() {
    this.render('hashtags.subscribed',{
    into: 'application',
    outlet: 'sidebar'
    });
  }
});