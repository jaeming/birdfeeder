import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['session'],
	actionsVisible: false,
	actions: {
		optionsShow: function() {
			var _this = this;
			this.set('actionsVisible', true);
			Ember.$('.account-box').mouseleave(function() {
				_this.set('actionsVisible', false);
			});
		}
	}
});
