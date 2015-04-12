import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortAscending: false,
  sortProperties: ['viewed:asc', 'published_at:desc'],
  currentPage: 1,
  hasMore: true,
  actions: {
    fetchMore: function(callback) {
      this.incrementProperty('currentPage');
      var promise = this.store.find('story', {page: this.get('currentPage')});
      this.set('model', promise)
      console.log(this.get('currentPage'));
    }
  }
});