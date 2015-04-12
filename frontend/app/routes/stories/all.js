import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var storyIndex = this.controllerFor('stories.all').get('currentPage');
    return this.store.find('story', {page: storyIndex});
    console.log(this.get('currentPage'));
  },
  renderTemplate: function() {
    this.render('stories.all',{
     into: 'application',
     outlet: 'body'
     });
  }
});
