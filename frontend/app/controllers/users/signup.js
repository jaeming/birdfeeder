import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['session'],
  actions: {
    signup: function() {
      var _this = this;
      var email = this.get('email');
      var name = this.get('name');
      var password = this.get('password');
      var passwordConfirmation = this.get('passwordConfirmation');
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url : '/api/users/',
        type: 'POST',
        dataType : "json",
        data: {"authenticity_token": token, "user":{"email": email, "name": name, "password": password, "password_confirmation": passwordConfirmation}},
        success: function(data) {
          console.log(data.user);
          _this.get('controllers.session').set('currentUser', {
          email: data.user['email'],
          name: data.user['name'],
          id: data.user['id'],
          avatar: data.user['avatar'],
          authenticated: true,
        });
          _this.set('errors', false);
          _this.transitionToRoute('/');
        },
        error: function(data) {
          var errors = data.responseJSON.errors;
          _this.set('errors', {
            email: errors['email'],
            password: errors['password'],
            password_confirmation: errors['password_confirmation'],
            name: errors['name']
          });
        }
      });
    }
  }
});
