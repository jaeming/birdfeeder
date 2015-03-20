import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  published_at: DS.attr('string'),
  created_at: DS.attr('string'),
  favorites_count: DS.attr('string'),
  subscribed: DS.attr('boolean'),
  hashtag: DS.belongsTo('hashtag', { async: true })
});
