import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['session', 'index'],
	actionsVisible: false,
	accountVisible: false,
	smallLogo: false,
	actions: {
		optionsShow: function() {
			var _this = this;
			this.set('actionsVisible', true);
			Ember.$('.account-box').mouseleave(function() {
				_this.set('actionsVisible', false);
			});
		},
		showSidePanel: function() {
			this.get('controllers.index').toggleProperty('sideVisible');
			this.get('controllers.index').toggleProperty('slidePanel');
			this.toggleProperty('accountVisible');
			this.toggleProperty('smallLogo');
		}
	}
});
