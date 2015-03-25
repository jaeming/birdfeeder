import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  avatar: DS.attr('string'),
  hashtags: DS.hasMany('hashtag', { async: true }),
  stories: DS.hasMany('story', { async: true })
});
