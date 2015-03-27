import Ember from 'ember';
import resetScrollMixin from "../../mixins/reset-scroll";

export default Ember.Route.extend(resetScrollMixin, {

  renderTemplate: function() {
    this.render('stories.subscribed',{
     into: 'application',
     outlet: 'body',
     controller: 'application'
     });
  }
});