import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['session', 'stories/favorites'],
  errors: null,
	actions: {
    loadMoreStories: function() {
      console.log('background loading stories');
      this.store.find('story', {all: true});
    },
		optionsShow: function() {
			var _this = this;
			this.set('actionsVisible', true);
			Ember.$('.account-box').mouseleave(function() {
				_this.set('actionsVisible', false);
			});
		},
    closeMobileSidePanel: function() {
      this.set('mobileSideVisible', false);
      this.set('mobileOpaquePane', false);
    },
		showSidePanel: function() {
      this.toggleProperty('hideSideBar');
      this.toggleProperty('fullView');
      this.toggleProperty('smallLogo');
      this.toggleProperty('appBarHide');
      this.toggleProperty('menuIconShow');
			this.toggleProperty('mobileSideVisible');
			this.toggleProperty('mobileOpaquePane');
		},
    closeSidebar: function() {
      this.set('menuIconShow', true);
      this.set('hideSideBar', true);
      this.set('fullView', true);
      this.set('smallLogo', true);
      this.set('appBarHide', true);
      this.set('menuIconShow', true);
    },
    signOut: function() {
      var _this = this;
      var token = this.get('controllers.session.currentUser.token');
      Ember.$.ajax({
        url: '/api/users/sign_out',
        type: 'DELETE',
        data: {"authenticity_token": token},
        success: function(result) {
          console.log(result);
          _this.get('controllers.session').set('currentUser', false);
          window.location.href = '/';
        }
      });
    }
	}
});
