import Ember from 'ember';

export default Ember.ArrayController.extend({
	needs: ['application'],
	scrollVisible: false,
	sideVisible: false,
	slidePanel: false,
	actions: {
		showScrollbar: function() {
		var _this = this;
		this.set('scrollVisible', true);
		Ember.$('.side-bar').mouseleave(function() {
			_this.set('scrollVisible', false);
		});
		},
		closeSidePanel: function() {
			this.toggleProperty('sideVisible', false);
			this.set('slidePanel', false);
			this.get('controllers.application').set('accountVisible', false);
			this.get('controllers.application').set('smallLogo', false);
		}
	}
});
