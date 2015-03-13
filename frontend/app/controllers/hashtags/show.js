import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.ObjectController.extend({
  needs: ['session', 'application'],

  currentPathChanged: function () {
    window.scrollTo(0, 0);
  }.observes('currentPath'),
  sortProperties: ['likes:desc', 'published_at:desc'],
  filteredStories: Ember.computed.sort('stories', 'sortProperties'),
  // pagedContent: pagedArray('filteredStories', {infinite: 'filteredStories'}),

  // page: 1,
  // perPage: 5,
  // sortProperties: ['likes:desc', 'published_at:desc'],
  // filteredContent: Ember.computed.sort('stories', 'sortProperties'),
  // pagedContent: pagedArray('filteredContent', {pageBinding: "page", perPageBinding: "perPage"}),
  // pageBinding: "pagedContent.page",
  // perPageBinding: "pagedContent.perPage",
  // totalPagesBinding: "pagedContent.totalPages",

  actions: {
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
