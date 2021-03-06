import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['session', 'stories/favorites'],

  // sortAscending: false,
  sortProperties: ['viewed:asc', 'published_at:desc'],
  sortedStories: Ember.computed.sort('model', 'sortProperties'),
  currentPage: 1,
  hasMore: true,

  actions: {
    fetchMore: function(callback) {
      var _this = this;
      this.set('hasMore', false);
      this.set('loadingButton', true);
      this.incrementProperty('currentPage');
      var promise = this.store.find('story', {page: this.get('currentPage')});
      Ember.run.later( function() {
        _this.set('model', promise);
        _this.set('loadingButton', false);
        _this.set('hasMore', true);
        window.scrollTo(0, 0);
      }, 100);
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
          hashtag.decrementProperty('stories_count');
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
        hashtag.incrementProperty('stories_count');
      });
    },
  }
});
