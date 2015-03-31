import Ember from 'ember';
import ScrollingMixin from 'frontend/mixins/scrolling';

module('ScrollingMixin');

// Replace this with your real tests.
test('it works', function() {
  var ScrollingObject = Ember.Object.extend(ScrollingMixin);
  var subject = ScrollingObject.create();
  ok(subject);
});
