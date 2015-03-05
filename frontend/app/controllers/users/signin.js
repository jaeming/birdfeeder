import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['session'],
  actions: {
    signin: function() {
      var _this = this;
      var email = this.get('email');
      var password = this.get('password');
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url : '/api/users/sign_in',
        type: 'POST',
        dataType : "json",
        data: {"authenticity_token": token, "user":{"email": email, "password": password}},
        success: function(data) {
          console.log(data.user);
          _this.get('controllers.session').set('currentUser', {
          email: data.user['email'],
          name: data.user['name'],
          id: data.user['id'],
          avatar: data.user['avatar'],
          authenticated: true
        });
          _this.transitionToRoute('/');
        },
        error: function() {
          //need an error message with response data here.
          console.log('sign in failed');
        }
      });
    }
  }
});


