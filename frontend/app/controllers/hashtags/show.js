import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['session', 'application'],

  currentPathChanged: function () {
    window.scrollTo(0, 0);
  }.observes('currentPath'),

  sortProperties: ['likes:desc', 'published_at:desc'],
  filteredStories: Ember.computed.sort('stories', 'sortProperties'),
  topStories: function() {
    return this.get('filteredStories').slice(0, 15);
  }.property('filteredStories.[]'),
  allStories: function() {
    var last = this.get('filteredStories.length');
    return this.get('filteredStories').slice(15, last);
  }.property('filteredStories.[]'),

  actions: {
    favorite: function(id) {
      var token = this.get('controllers.session.currentUser.token');
      var _this = this;
      var story = this.store.find('story', id);
      Ember.$.ajax({
        url: '/api/favorites',
        type: 'POST',
        dataType: 'json',
        data: {'authenticity_token': token, 'story_id': id},
        success: function(data) {
          story.set('favorited', data.story.favorited);
        },
        error: function() {
          _this.set('controllers.application.errors', 'favorite failed, try again later.');
          Ember.run.later( function() {
            _this.set('controllers.application.errors', false);
          }, 3000);
        }
      });
    },
    unfavorite: function(id) {
      var token = this.get('controllers.session.currentUser.token');
      var _this = this;
      var story = this.store.find('story', id);
      Ember.$.ajax({
        url: '/api/favorites/'+id,
        type: 'DELETE',
        dataType: 'json',
        data: {'authenticity_token': token, 'story_id': id},
        success: function(data) {
          story.set('favorited', data.story.favorited);
        },
        error: function() {
          _this.set('controllers.application.errors', 'unfavorite failed, try again later.');
          Ember.run.later( function() {
            _this.set('controllers.application.errors', false);
          }, 3000);
        }
      });
    },
    loadAll: function() {
      this.set('showAllStories', true);
      this.set('showMoreButton', false);
    },
    subscribe: function(id) {
      var _this = this;
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/subscriptions',
        type: 'POST',
        dataType: 'json',
        data: {'authenticity_token': token, 'hashtag_id': id},
        success: function(data) {
          _this.set('subscribed', data.hashtag.subscribed);
        },
        error: function() {
          _this.set('controllers.application.errors', 'Subscription failed, try again later.');
          Ember.run.later( function() {
            _this.set('controllers.application.errors', false);
          }, 3000);
        }
      });
    },
    unsubscribe: function(id) {
      var _this = this;
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/subscriptions/'+id,
        type: 'DELETE',
        dataType: 'json',
        data: {'authenticity_token': token, 'hashtag_id': id},
        success: function() {
          _this.set('subscribed', false);
        },
        error: function() {
          _this.set('controllers.application.errors', 'Unsubscribe failed, try again later.');
          Ember.run.later( function() {
            _this.set('controllers.application.errors', false);
          }, 3000);
        }
      });
    }
  }
});
