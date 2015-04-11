import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['session', 'application', 'stories/favorites'],
  actions: {
    markViewed: function(obj) {
      console.log(obj.hashtag_id);
      var _this = this;
      var story = this.store.find('story', obj.id);
      var hashtag = this.get('hashtag');
      var token = this.get('controllers.session.currentUser.token');
      var request = new Ember.RSVP.Promise(function(resolve) {
        Ember.$.ajax({
          url: '/api/views/',
          type: 'POST',
          dataType: 'json',
          data: {'authenticity_token': token, 'story_id': obj.id, 'hashtag_id': obj.hashtag_id},
          success: function(response) {
            resolve(response);
          }
        });
      });

      request.then(function(response) {
        console.log(response);
        story.set('marked', true);
        var storyCount = hashtag.get('stories_count');
        hashtag.set('stories_count', --storyCount);
      });
    },
    unmarkViewed: function(id, hashtag) {
      var _this = this;
      var story = this.store.find('story', id);
      var hashtag = this.get('hashtag');
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
        story.set('marked', false);
        story.set('viewed', false);
        var storyCount = hashtag.get('stories_count');
        hashtag.set('stories_count', ++storyCount);
      });
    }
  }
});
