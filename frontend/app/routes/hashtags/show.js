import Ember from 'ember';
import resetScrollMixin from "../../mixins/reset-scroll";

export default Ember.Route.extend(resetScrollMixin, {
  model: function(params) {
    return this.store.find('hashtag', params.title);
  },
  renderTemplate: function() {
    this.render({outlet: 'body'});
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('showAllStories', false);
    var storyCount = controller.get('stories.length');
    if(storyCount < 13) {
      controller.set('showMoreButton', false);
    } else {
      controller.set('showMoreButton', true);
    }
  }
});
