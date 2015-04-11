import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Controller.extend({
  needs: ['session', 'stories/favorites'],
  errors: null,
  loadBar: false,
  sortProperties: ['viewed:asc', 'published_at:desc'],
  sortedStories: Ember.computed.sort('stories', 'sortProperties'),
  pagedContent: pagedArray('sortedStories', {infinite: "unpaged"}),
  actionsVisible: false,
	accountVisible: false,
	smallLogo: false,
  sideHovered: false,
  sideVisible: false,
  slidePanel: false,
  hideSideBar: false,
  sideCollapsed: false,
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
      this.set('mainPaneSmall', false);
      this.set('sideCollapsed', false);
      this.set('sideHovered', false);
      this.set('accountBoxHide', false);
      this.set('appBarHide', false);
      this.set('hideSideBar', false);
      this.set('fullMainPane', false);
		},
    closeSidePanel: function() {
    	if(this.get('slidePanel', true)) {
				this.set('sideVisible', false);
	      this.set('slidePanel', false);
	      this.set('accountVisible', false);
	      this.set('smallLogo', false);
        this.set('sideHovered', false);
        this.set('mainPaneSmall', true);
			}
    },
    showFullView: function() {
      this.set('hideSideBar', true);
      this.set('fullMainPane', true);
      this.set('accountBoxHide', true);
      this.set('appBarHide', true);
      this.set('sideCollapsed', true);
      this.set('mainPaneSmall', true);
    },
    pinSideBar: function() {
      this.set('hideSideBar', false);
      this.set('fullMainPane', false);
      this.set('accountBoxHide', false);
      this.set('appBarHide', false);
      this.set('sideCollapsed', false);
      this.set('sideHovered', false);
      this.set('mainPaneSmall', false);
    },
    hoverSidebar: function() {
      var _this = this;
      if(this.get('hideSideBar', false)) {
        this.set('hideSideBar', false);
        this.set('fullMainPane', false);
        this.set('accountBoxHide', false);
        this.set('appBarHide', false);
        this.set('sideCollapsed', true);
        this.set('sideHovered', true);
        this.set('mainPaneSmall', false);
      }
      Ember.$('.side-bar').mouseleave(function() {
        if(_this.get('sideHovered', true)) {
        _this.set('hideSideBar', true);
        _this.set('fullMainPane', true);
        _this.set('accountBoxHide', true);
        _this.set('appBarHide', true);
        _this.set('sideHovered', false);
        _this.set('mainPaneSmall', true);
        }
      });
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
        var storyCount = hashtag.get('stories_count');
        if(storyCount > 0) {
          hashtag.set('stories_count', --storyCount);
        }
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
        story.set('viewed', false);
        var storyCount = hashtag.get('stories_count');
        hashtag.set('stories_count', ++storyCount);
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
