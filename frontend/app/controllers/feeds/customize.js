import Ember from 'ember';
export default Ember.ArrayController.extend({
  needs: ['session'],
  actions: {
    addFeed: function() {
      var _this = this;
      var url = this.get('url');
      var category = this.get('category');
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/feeds/',
        type: 'POST',
        dataType: "json",
        data: {"authenticity_token": token, "feed":{"url": url, "hashtag": category}},
        success: function(data) {
          console.log(data);
          _this.set('url', '');
          _this.set('category', '');
          _this.store.find('story');
          _this.store.find('hashtag');
          _this.transitionToRoute('hashtags.show', data);
        },
        error: function() {
          console.log('that went badly');
        }
      });
    },
    searchCategories: function() {
      var searchTerm = this.get('search');
      var results = this.store.find('hashtag', { title: searchTerm });
      this.set('results', results);
    }
  }
});
