import Ember from 'ember';
import resetScrollMixin from "../../mixins/reset-scroll";

export default Ember.Route.extend(resetScrollMixin, {
  model: function(params) {
    return this.store.find('hashtag', params.hashtag_id);
  },
  renderTemplate: function() {
    this.render({outlet: 'body'});
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    
  }
});
