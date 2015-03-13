import Ember from 'ember';

export default Ember.Mixin.create({
  activate: function() {
    this._super();
    console.log('active mixin here');
    window.scrollTo(0,0);
  }
});
