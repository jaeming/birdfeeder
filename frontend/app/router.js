import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('hashtags', {path: '/'}, function() {
    this.route('show', {path: ':hashtag_id'});
  });
  this.resource('feeds', function() {
    this.route('show', {path: ':feed_id'});
  });
});

export default Router;
