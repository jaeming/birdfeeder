import Ember from 'ember';

export default Ember.Controller.extend({
	scrollVisible: false,
	actions: {
		showScrollbar: function() {
		var _this = this;
		this.set('scrollVisible', true);
		Ember.$('.side-bar').mouseleave(function() {
			console.log("exit sidebar");
			_this.set('scrollVisible', false);
		});
	}
	}
});
