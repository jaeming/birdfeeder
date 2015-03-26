import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['session', 'application'],

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
    }
  }
});
