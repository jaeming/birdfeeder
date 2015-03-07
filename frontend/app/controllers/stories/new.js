import Ember from 'ember';
export default Ember.ObjectController.extend({
  needs: ['session'],
  actions: {
    save: function() {
      var _this = this;
      var url = this.get('url');
      var category = this.get('category');
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/stories/',
        type: 'POST',
        dataType: "json",
        data: {"authenticity_token": token, "story":{"feed_url": url,}},
        success: function(data) {
          console.log(data);
          console.log('Great!, we should be generating stories now!');
        },
        error: function() {
          console.log('that went badly');
        }

      });
    }
  }
});