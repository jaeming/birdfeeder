import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['session', 'application', 'stories/favorites'],

  actions: {
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
        var storyCountDeduct = _this.get('stories_count') - 1;
        _this.set('stories_count', storyCountDeduct);
        // story.set('viewed', response.viewed);
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
        // story.set('viewed', response.viewed);
        story.set('marked', false);
        var storyCountAdd = _this.get('stories_count') + 1;
        _this.set('stories_count', storyCountAdd);
      });
    }
  }
});
