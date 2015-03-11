import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  stories: DS.hasMany('story' , { async: true }),
  users: DS.hasMany('user' , { async: true }),
  subscribed: DS.attr('boolean')
});
