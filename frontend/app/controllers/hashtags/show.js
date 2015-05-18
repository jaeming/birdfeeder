import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['session', 'application', 'stories/favorites'],

  currentPathChanged: function () {
    window.scrollTo(0, 0);
  }.observes('currentPath'),
  sortProperties: ['viewed:asc', 'created_at:desc'],
  filteredStories: Ember.computed.sort('stories', 'sortProperties'),
  topStories: function() {
    return this.get('filteredStories').slice(0, 12);
  }.property('filteredStories.[]'),
  allStories: function() {
    var last = this.get('filteredStories.length');
    return this.get('filteredStories').slice(12, last);
  }.property('filteredStories.[]'),
  updatedVisible: false,

  actions: {
    loadAll: function() {
      var _this = this;
      this.set('showMoreButton', false);
      this.set('loadingButton', true);
      Ember.run.later( function() {
        _this.set('showAllStories', true);
      }, 100);
      Ember.run.later( function() {
        _this.set('loadingButton', false);
      }, 1200);
    },
    markViewed: function(obj) {
      var _this = this;
      var story = this.store.find('story', obj.id);
      var hashtag_id = this.get('id');
      var token = this.get('controllers.session.currentUser.token');
      var request = new Ember.RSVP.Promise(function(resolve) {
        Ember.$.ajax({
          url: '/api/views/',
          type: 'POST',
          dataType: 'json',
          data: {'authenticity_token': token, 'story_id': obj.id, 'hashtag_id': hashtag_id},
          success: function(response) {
            resolve(response);
          }
        });
      });

      request.then(function(response) {
        console.log(response);
        story.set('marked', true);
        var storyCount = _this.get('stories_count');
        if(storyCount > 0) {
          _this.decrementProperty('stories_count');
        }
      });
    },
    unmarkViewed: function(id) {
      var _this = this;
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

      request.then(function(response) {
        console.log(response);
        story.set('marked', false);
        story.set('viewed', false);
        _this.incrementProperty('stories_count');
      });
    },
    updateStories: function(id) {
      this.set('loadingVisible', true);
      var _this = this;
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/feeds/update',
        type: 'POST',
        dataType: 'json',
        data: {'authenticity_token': token, 'hashtag_id': id},
        success: function(data) {
          _this.store.pushPayload('story', data);
          _this.get('target.router').refresh();
          _this.set('updatedVisible', true);
          Ember.run.later( function() {
            _this.set('loadingVisible', false);
          }, 1300);
          Ember.run.later( function() {
            _this.set('updatedVisible', false);
          }, 3000);
        },
        error: function() {
          _this.set('loadingVisible', false);
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
          _this.get('target.router').refresh();
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
      this.set('subscribed', false);
      Ember.$.ajax({
        url: '/api/subscriptions/'+id,
        type: 'DELETE',
        dataType: 'json',
        data: {'authenticity_token': token, 'hashtag_id': id},
        success: function() {
          _this.get('target.router').refresh();
          _this.transitionToRoute('/stories/subscribed');
        },
        error: function() {
          _this.set('subscribed', true);
          _this.set('controllers.application.errors', 'Unsubscribe failed, try again later.');
          Ember.run.later( function() {
            _this.set('controllers.application.errors', false);
          }, 3000);
        }
      });
    }
  }
});
