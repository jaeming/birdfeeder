import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortAscending: false,
  sortProperties: ['likes', 'published_at'],
});

