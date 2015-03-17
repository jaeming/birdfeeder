import Ember from 'ember';
import InfiniteMixin from 'frontend/mixins/infinite';

module('InfiniteMixin');

// Replace this with your real tests.
test('it works', function() {
  var InfiniteObject = Ember.Object.extend(InfiniteMixin);
  var subject = InfiniteObject.create();
  ok(subject);
});
