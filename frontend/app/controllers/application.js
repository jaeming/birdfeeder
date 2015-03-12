import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Controller.extend({
  needs: ['session'],
  errors: null,
  sortProperties: ['likes:desc', 'published_at:desc'],
  sortedStories: Ember.computed.sort('stories', 'sortProperties'),
  pagedContent: pagedArray('sortedStories', {infinite: "unpaged"}),
  actionsVisible: false,
	accountVisible: false,
	smallLogo: false,
	scrollVisible: false,
  sideVisible: false,
  slidePanel: false,
	actions: {
    loadNext: function() {
      this.get('pagedContent').loadNextPage();
    },
		optionsShow: function() {
			var _this = this;
			this.set('actionsVisible', true);
			Ember.$('.account-box').mouseleave(function() {
				_this.set('actionsVisible', false);
			});
		},
		showSidePanel: function() {
			this.toggleProperty('sideVisible');
			this.toggleProperty('slidePanel');
			this.toggleProperty('accountVisible');
			this.toggleProperty('smallLogo');
		},
		showScrollbar: function() {
    var _this = this;
    this.set('scrollVisible', true);
    Ember.$('.side-bar').mouseleave(function() {
      _this.set('scrollVisible', false);
    });
    },
    closeSidePanel: function() {
    	if(this.get('slidePanel', true)) {
				this.set('sideVisible', false);
	      this.set('slidePanel', false);
	      this.set('accountVisible', false);
	      this.set('smallLogo', false);
			}
			else {
				console.log('slide panel not active yet');
			}
    }
	}
});
