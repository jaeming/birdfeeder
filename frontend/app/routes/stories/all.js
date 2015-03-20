import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate: function() {
    this.render('stories.all',{
     into: 'application',
     outlet: 'body',
     controller: 'application'
     });
  }
});
