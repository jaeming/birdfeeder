import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['session'],
  changePassword: false,
  deleteConfirm: false,
  email: function() {
    var currentEmail = this.get('controllers.session.currentUser.email');
    return currentEmail;
  }.property('controllers.session.currentUser.email'),
  name: function() {
    var currentName = this.get('controllers.session.currentUser.name');
    return currentName;
  }.property('controllers.session.currentUser.name'),
  actions: {
    showPasswordOptions: function() {
      this.set('changePassword', true);
    },
    hidePasswordOptions: function() {
      this.set('changePassword', false);
    },
    dismissError: function() {
      this.set('errors', false);
    },
    deletePrompt: function () {
      this.set('deleteConfirm', true);
    },
    deleteCancel: function () {
      this.set('deleteConfirm', false);
    },
    deleteAccount: function() {
      var currentUserId = this.get('controllers.session.currentUser.id');
      this.store.find('user', currentUserId).then(function (user) {
        user.destroyRecord();
        window.location.href = '/';
      });

    },
    update: function() {
      var _this = this;
      var email = this.get('email');
      var name = this.get('name');
      var newPassword = this.get('newPassword');
      var newPasswordConfirmation = this.get('newPasswordConfirmation');
      var token = this.get('controllers.session.currentUser.token');
      var formParams = {"authenticity_token": token, "user":{"email": email, "name": name, "password": newPassword, "password_confirmation": newPasswordConfirmation}};
      if(newPassword === '' && newPasswordConfirmation === ''){
        formParams = {"authenticity_token": token, "user":{"email": email, "name": name}};
      }else{
        formParams = {"authenticity_token": token, "user":{"email": email, "name": name, "password": newPassword, "password_confirmation": newPasswordConfirmation}};
      }
      if(newPassword === newPasswordConfirmation){
        console.log('Passwords match');
        Ember.$.ajax({
          url : '/api/users/',
          type: 'PATCH',
          dataType : "json",
          data: formParams,
          success: function(data) {
            _this.get('controllers.session').set('currentUser', {
            email: data.user['email'],
            name: data.user['name'],
            id: data.user['id'],
            avatar: data.user['avatar'],
            token: data.user['token'],
            authenticated: true,
          });
            _this.set('errors', false);
            _this.set('newPassword', '');
            _this.set('newPasswordConfirmation', '');
            _this.set('changePassword', false);
            _this.transitionToRoute('/stories/subscribed');
          },
          error: function(data) {
            console.log(data);
            var errors = data.responseJSON.errors;
            _this.set('errors', {
              email: errors['email'],
              password: errors['password'],
              password_confirmation: errors['password_confirmation'],
              name: errors['name']
            });
          }
        });
      }else{
        _this.set('errors', {
          password: "doesn't match confirmation"
        });
      }
    },
  }
});
