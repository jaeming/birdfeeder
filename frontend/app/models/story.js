import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  published_at: DS.attr('string'),
  likes: DS.attr(),
  hashtag: DS.belongsTo('hashtag', { async: true })
});
