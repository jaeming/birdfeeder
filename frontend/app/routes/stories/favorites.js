import Ember from 'ember';
import resetScrollMixin from "../../mixins/reset-scroll";

export default Ember.Route.extend(resetScrollMixin, {
  model: function() {
    return this.store.find('story', { favorite: true });
  },
  renderTemplate: function() {
    this.render('stories.favorites',{
     into: 'application',
     outlet: 'body'
     });
  }
});
