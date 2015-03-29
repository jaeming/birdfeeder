import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['session', 'application', 'stories/favorites'],

  currentPathChanged: function () {
    window.scrollTo(0, 0);
  }.observes('currentPath'),

  sortProperties: ['favorites_count:desc', 'published_at:desc'],
  filteredStories: Ember.computed.sort('stories', 'sortProperties'),
  topStories: function() {
    return this.get('filteredStories').slice(0, 15);
  }.property('filteredStories.[]'),
  allStories: function() {
    var last = this.get('filteredStories.length');
    return this.get('filteredStories').slice(15, last);
  }.property('filteredStories.[]'),
  updatedVisible: false,

  actions: {
    loadAll: function() {
      this.set('showAllStories', true);
      this.set('showMoreButton', false);
    },
    updateStories: function(id) {
      var _this = this;
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/feeds/update',
        type: 'POST',
        dataType: 'json',
        data: {'authenticity_token': token, 'hashtag_id': id},
        success: function(data) {
          console.log(data);
          _this.store.pushPayload('story', data);
          _this.set('updatedVisible', true);
          Ember.run.later( function() {
            _this.set('updatedVisible', false);
          }, 3000);
        },
        error: function() {
          _this.set('controllers.application.errors', 'update failed, try again later.');
          Ember.run.later( function() {
            _this.set('controllers.application.errors', false);
          }, 3000);
        }
      });
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
