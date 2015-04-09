import Ember from 'ember';
export default Ember.ArrayController.extend({
  needs: ['session', 'hashtags/show'],
  results: [''],
  browseAll: false,
  searched: false,
  actions: {
    addFeed: function() {
      this.set('loadingVisible', true);
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
          _this.set('url', '');
          _this.set('category', '');
          _this.store.find('story');
          _this.store.find('hashtag');
          _this.transitionToRoute('hashtags.show', data);
          _this.get('target.router').refresh();
        },
        error: function() {
          console.log('that went badly');
          _this.set('loadingVisible', false);
        }
      });
    },
    searchCategories: function() {
      var searchTerm = this.get('search');
      var results = this.store.find('hashtag', { title: searchTerm });
      this.set('results', results);
      this.set('searched', true);
    },
    fetchCategories: function() {
      var categories = this.store.find('hashtag');
      this.set('categories', categories);
      this.set('browseAll', true);
    },
    hideCategories: function() {
      this.set('browseAll', false);
    },
    subscribe: function(id) {
      this.set('subscribed', true);
      var _this = this;
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/subscriptions',
        type: 'POST',
        dataType: 'json',
        data: {'authenticity_token': token, 'hashtag_id': id},
        success: function() {
          _this.get('target.router').refresh();
        },
        error: function() {
          _this.set('subscribed', false);
          _this.set('controllers.application.errors', 'Subscription failed, try again later.');
          Ember.run.later( function() {
            _this.set('controllers.application.errors', false);
          }, 3000);
        }
      });
    },
    unsubscribe: function(id) {
      this.set('subscribed', false);
      var _this = this;
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/subscriptions/'+id,
        type: 'DELETE',
        dataType: 'json',
        data: {'authenticity_token': token, 'hashtag_id': id},
        success: function() {
          _this.get('target.router').refresh();
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
