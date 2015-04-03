import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Controller.extend({
  needs: ['session', 'stories/favorites'],
  errors: null,
  sortProperties: ['viewed:asc', 'published_at:desc'],
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
    },
    markViewed: function(obj) {
      var story = this.store.find('story', obj.id);
      var hashtag = this.store.find('hashtag', obj.hashtag_id);
      var token = this.get('controllers.session.currentUser.token');
      var request = new Ember.RSVP.Promise(function(resolve) {
        Ember.$.ajax({
          url: '/api/views/',
          type: 'POST',
          dataType: 'json',
          data: {'authenticity_token': token, 'story_id': obj.id, 'hashtag_id': hashtag.id},
          success: function(response) {
            resolve(response);
          }
        });
      });

      request.then(function() {
        story.set('marked', true);
        var storyCountDeduct = hashtag.get('stories_count') - 1;
        hashtag.set('stories_count', storyCountDeduct);
      });
    },
    unmarkViewed: function(id, hashtag) {
      var story = this.store.find('story', id);
      var token = this.get('controllers.session.currentUser.token');
      var request = new Ember.RSVP.Promise(function(resolve) {
        Ember.$.ajax({
          url: '/api/views/'+id,
          type: 'DELETE',
          dataType: 'json',
          data: {'authenticity_token': token, 'story_id': id},
          success: function(response) {
            resolve(response);
          }
        });
      });

      request.then(function() {
        story.set('marked', false);
        var storyCountAdd = hashtag.get('stories_count') + 1;
        hashtag.set('stories_count', storyCountAdd);
      });
    },
    signOut: function() {
      var _this = this;
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/users/sign_out',
        type: 'DELETE',
        data: {"authenticity_token": token},
        success: function(result) {
          console.log(result);
          _this.get('controllers.session').set('currentUser', false);
          window.location.href = '/';
        }
      });
    }
	}
});
