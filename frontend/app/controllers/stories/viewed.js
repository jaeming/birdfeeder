import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['session', 'application'],

  actions: {
    markViewed: function(id) {
      var story = this.store.find('story', id);
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/stories/' + id,
        type: 'PATCH',
        dataType: 'json',
        data: {'authenticity_token': token, 'story_id': id, 'story': {'viewed': true}},
        success: function(data) {
          console.log(data);
          story.set('viewed', data.viewed);
        }
      });
    }
  }
});
