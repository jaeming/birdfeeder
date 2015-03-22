import Ember from 'ember';
// import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.ObjectController.extend({
  needs: ['session', 'application'],

  currentPathChanged: function () {
    window.scrollTo(0, 0);
    this.set('showAllStories', false);
    var storyCount = this.get('stories.length');
    if(storyCount < 16) {
      this.set('showMoreButton', false);
    } else {
      this.set('showMoreButton', true);
    }
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
