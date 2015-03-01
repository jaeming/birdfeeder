import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('hashtags.show', {outlet: 'articles'});
    this.render('hashtags.index', {into: 'hashtags'});
  }
});