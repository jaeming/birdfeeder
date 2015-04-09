import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['session', 'application'],
  actions: {
    signin: function() {
      this.set('loadingVisible', true);
      var _this = this;
      var email = this.get('email');
      var password = this.get('password');
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url : '/api/users/sign_in',
        type: 'POST',
        dataType: "json",
        data: {"authenticity_token": token, "user":{"email": email, "password": password}},
        success: function(data) {
          console.log(data.user);
          _this.get('controllers.session').set('currentUser', {
          email: data.user['email'],
          name: data.user['name'],
          id: data.user['id'],
          avatar: data.user['avatar'],
          token: data.user['token'],
          authenticated: true
        });
          _this.get('target.router').refresh();
          _this.transitionToRoute('/');
        },
        error: function(data) {
          this.set('loadingVisible', false);
          var message = data.responseJSON.error;
          console.log(message);
          _this.set('controllers.application.errors', message);
          Ember.run.later( function() {
            _this.set('controllers.application.errors', false);
          }, 3000);
        }
      });
    }
  }
});
