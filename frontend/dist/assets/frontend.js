define("frontend/adapters/application", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.RESTAdapter.extend({
        coalesceFindRequests: true,
        namespace: 'api',
    });
  });
define("frontend/app", 
  ["ember","ember/resolver","ember/load-initializers","frontend/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("frontend/components/infinite-scroll", 
  ["ember-infinite-scroll/components/infinite-scroll","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var InfiniteScroll = __dependency1__["default"];

    __exports__["default"] = InfiniteScroll;
  });
define("frontend/components/page-numbers", 
  ["ember","ember-cli-pagination/util","ember-cli-pagination/lib/page-items","ember-cli-pagination/validate","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Util = __dependency2__["default"];
    var PageItems = __dependency3__["default"];
    var Validate = __dependency4__["default"];

    __exports__["default"] = Ember.Component.extend({
      currentPageBinding: "content.page",
      totalPagesBinding: "content.totalPages",

      hasPages: Ember.computed.gt('totalPages', 1),

      watchInvalidPage: function() {
        var me = this;
        var c = this.get('content');
        if (c && c.on) {
          c.on('invalidPage', function(e) {
            me.sendAction('invalidPageAction',e);
          });
        }
      }.observes("content"),

      truncatePages: true,
      numPagesToShow: 10,

      validate: function() {
        if (Util.isBlank(this.get('currentPage'))) {
          Validate.internalError("no currentPage for page-numbers");
        }
        if (Util.isBlank(this.get('totalPages'))) {
          Validate.internalError('no totalPages for page-numbers');
        }
      },

      pageItemsObj: function() {
        return PageItems.create({
          parent: this,
          currentPageBinding: "parent.currentPage",
          totalPagesBinding: "parent.totalPages",
          truncatePagesBinding: "parent.truncatePages",
          numPagesToShowBinding: "parent.numPagesToShow",
          showFLBinding: "parent.showFL"
        });
      }.property(),

      //pageItemsBinding: "pageItemsObj.pageItems",

      pageItems: function() {
        this.validate();
        return this.get("pageItemsObj.pageItems");
      }.property("pageItemsObj.pageItems","pageItemsObj"),

      canStepForward: (function() {
        var page = Number(this.get("currentPage"));
        var totalPages = Number(this.get("totalPages"));
        return page < totalPages;
      }).property("currentPage", "totalPages"),

      canStepBackward: (function() {
        var page = Number(this.get("currentPage"));
        return page > 1;
      }).property("currentPage"),

      actions: {
        pageClicked: function(number) {
          Util.log("PageNumbers#pageClicked number " + number);
          this.set("currentPage", number);
          this.sendAction('action',number);
        },
        incrementPage: function(num) {
          var currentPage = Number(this.get("currentPage")),
              totalPages = Number(this.get("totalPages"));

          if(currentPage === totalPages && num === 1) { return false; }
          if(currentPage <= 1 && num === -1) { return false; }
          this.incrementProperty('currentPage', num);

          var newPage = this.get('currentPage');
          this.sendAction('action',newPage);
        }
      }
    });
  });
define("frontend/controllers/application", 
  ["ember","ember-cli-pagination/computed/paged-array","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var pagedArray = __dependency2__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: ['session'],
      errors: null,
      sortProperties: ['favorites_count:desc', 'published_at:desc'],
      sortedStories: Ember.computed.sort('stories', 'sortProperties'),
      pagedContent: pagedArray('sortedStories', {infinite: "unpaged"}),
      actionsVisible: false,
    	accountVisible: false,
    	smallLogo: false,
    	scrollVisible: false,
      sideVisible: false,
      slidePanel: false,
    	actions: {
        loadNext: function() {
          this.get('pagedContent').loadNextPage();
        },
    		optionsShow: function() {
    			var _this = this;
    			this.set('actionsVisible', true);
    			Ember.$('.account-box').mouseleave(function() {
    				_this.set('actionsVisible', false);
    			});
    		},
    		showSidePanel: function() {
    			this.toggleProperty('sideVisible');
    			this.toggleProperty('slidePanel');
    			this.toggleProperty('accountVisible');
    			this.toggleProperty('smallLogo');
    		},
    		showScrollbar: function() {
        var _this = this;
        this.set('scrollVisible', true);
        Ember.$('.side-bar').mouseleave(function() {
          _this.set('scrollVisible', false);
        });
        },
        closeSidePanel: function() {
        	if(this.get('slidePanel', true)) {
    				this.set('sideVisible', false);
    	      this.set('slidePanel', false);
    	      this.set('accountVisible', false);
    	      this.set('smallLogo', false);
    			}
    			else {
    				console.log('slide panel not active yet');
    			}
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
            }
          });
        }
    	}
    });
  });
define("frontend/controllers/feeds/customize", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.ArrayController.extend({
      needs: ['session'],
      actions: {
        addFeed: function() {
          var _this = this;
          var url = this.get('url');
          var category = this.get('category');
          var token = this.get('controllers.session.currentUser.token');
          Ember.$.ajax({
            url: '/api/feeds/',
            type: 'POST',
            dataType: "json",
            data: {"authenticity_token": token, "feed":{"url": url, "hashtag": category}},
            success: function(data) {
              console.log(data);
              _this.set('url', '');
              _this.set('category', '');
              _this.store.find('story');
              _this.store.find('hashtag');
              _this.transitionToRoute('hashtags.show', data);
            },
            error: function() {
              console.log('that went badly');
            }
          });
        },
        searchCategories: function() {
          var searchTerm = this.get('search');
          var results = this.store.find('hashtag', { title: searchTerm });
          this.set('results', results);
        }
      }
    });
  });
define("frontend/controllers/hashtags/show", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    // import pagedArray from 'ember-cli-pagination/computed/paged-array';

    __exports__["default"] = Ember.ObjectController.extend({
      needs: ['session', 'application'],

      currentPathChanged: function () {
        window.scrollTo(0, 0);
        this.set('showAllStories', false);
        var storyCount = this.get('stories.length');
        if(storyCount < 16) {
          this.set('showMoreButton', false);
        } else {
          this.set('showMoreButton', true);
        }
      }.observes('currentPath'),

      sortProperties: ['likes:desc', 'published_at:desc'],
      filteredStories: Ember.computed.sort('stories', 'sortProperties'),
      topStories: function() {
        return this.get('filteredStories').slice(0, 15);
      }.property('filteredStories.[]'),
      allStories: function() {
        var last = this.get('filteredStories.length');
        return this.get('filteredStories').slice(15, last);
      }.property('filteredStories.[]'),

      actions: {
        loadAll: function() {
          this.set('showAllStories', true);
          this.set('showMoreButton', false);
        },
        subscribe: function(id) {
          var _this = this;
          var token = this.get('controllers.session.currentUser.token');
          Ember.$.ajax({
            url: '/api/subscriptions',
            type: 'POST',
            dataType: 'json',
            data: {'authenticity_token': token, 'hashtag_id': id},
            success: function(data) {
              _this.set('subscribed', data.hashtag.subscribed);
            },
            error: function() {
              _this.set('controllers.application.errors', 'Subscription failed, try again later.');
              Ember.run.later( function() {
                _this.set('controllers.application.errors', false);
              }, 3000);
            }
          });
        },
        unsubscribe: function(id) {
          var _this = this;
          var token = this.get('controllers.session.currentUser.token');
          Ember.$.ajax({
            url: '/api/subscriptions/'+id,
            type: 'DELETE',
            dataType: 'json',
            data: {'authenticity_token': token, 'hashtag_id': id},
            success: function() {
              _this.set('subscribed', false);
            },
            error: function() {
              _this.set('controllers.application.errors', 'Unsubscribe failed, try again later.');
              Ember.run.later( function() {
                _this.set('controllers.application.errors', false);
              }, 3000);
            }
          });
        }
      }
    });
  });
define("frontend/controllers/session", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      currentUser: null
    });
  });
define("frontend/controllers/stories/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({
      sortAscending: false,
      sortProperties: ['likes', 'published_at'],
    });
  });
define("frontend/controllers/users/signin", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: ['session', 'application'],
      actions: {
        signin: function() {
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
              authenticated: true
            });
              _this.transitionToRoute('/');
            },
            error: function(data) {
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
  });
define("frontend/controllers/users/signup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
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
  });
define("frontend/helpers/fa-icon", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var FA_PREFIX = /^fa\-.+/;

    var warn = Ember.Logger.warn;

    /**
     * Handlebars helper for generating HTML that renders a FontAwesome icon.
     *
     * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
     *                          For example, you can pass in either `fa-camera` or just `camera`.
     * @param  {Object} options Options passed to helper.
     * @return {Ember.Handlebars.SafeString} The HTML markup.
     */
    var faIcon = function(name, options) {
      if (Ember.typeOf(name) !== 'string') {
        var message = "fa-icon: no icon specified";
        warn(message);
        return Ember.String.htmlSafe(message);
      }

      var params = options.hash,
        classNames = [],
        html = "";

      classNames.push("fa");
      if (!name.match(FA_PREFIX)) {
        name = "fa-" + name;
      }
      classNames.push(name);
      if (params.spin) {
        classNames.push("fa-spin");
      }
      if (params.flip) {
        classNames.push("fa-flip-" + params.flip);
      }
      if (params.rotate) {
        classNames.push("fa-rotate-" + params.rotate);
      }
      if (params.lg) {
        warn("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}");
        classNames.push("fa-lg");
      }
      if (params.x) {
        warn("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"" + params.x + "\"}}");
        classNames.push("fa-" + params.x + "x");
      }
      if (params.size) {
        if (Ember.typeOf(params.size) === "string" && params.size.match(/\d+/)) {
          params.size = Number(params.size);
        }
        if (Ember.typeOf(params.size) === "number") {
          classNames.push("fa-" + params.size + "x");
        } else {
          classNames.push("fa-" + params.size);
        }
      }
      if (params.fixedWidth) {
        classNames.push("fa-fw");
      }
      if (params.listItem) {
        classNames.push("fa-li");
      }
      if (params.pull) {
        classNames.push("pull-" + params.pull);
      }
      if (params.border) {
        classNames.push("fa-border");
      }
      if (params.classNames && !Ember.isArray(params.classNames)) {
        params.classNames = [ params.classNames ];
      }
      if (!Ember.isEmpty(params.classNames)) {
        Array.prototype.push.apply(classNames, params.classNames);
      }


      html += "<";
      var tagName = params.tagName || 'i';
      html += tagName;
      html += " class='" + classNames.join(" ") + "'";
      if (params.title) {
        html += " title='" + params.title + "'";
      }
      if (params.ariaHidden === undefined || params.ariaHidden) {
        html += " aria-hidden=\"true\"";
      }
      html += "></" + tagName + ">";
      return Ember.String.htmlSafe(html);
    };

    __exports__.faIcon = faIcon;

    __exports__["default"] = Ember.Handlebars.makeBoundHelper(faIcon);
  });
define("frontend/initializers/ember-cli-dates", 
  ["ember","ember-cli-dates/helpers/time-format","ember-cli-dates/helpers/time-ago-in-words","ember-cli-dates/helpers/day-of-the-week","ember-cli-dates/helpers/time-ahead-in-words","ember-cli-dates/helpers/time-delta-in-words","ember-cli-dates/helpers/month-and-year","ember-cli-dates/helpers/month-and-day","ember-cli-dates/helpers/date-and-time","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var timeFormat = __dependency2__.timeFormat;
    var timeAgoInWords = __dependency3__.timeAgoInWords;
    var dayOfTheWeek = __dependency4__.dayOfTheWeek;
    var timeAheadInWords = __dependency5__.timeAheadInWords;
    var timeDeltaInWords = __dependency6__.timeDeltaInWords;
    var monthAndYear = __dependency7__.monthAndYear;
    var monthAndDay = __dependency8__.monthAndDay;
    var dateAndTime = __dependency9__.dateAndTime;

    var initialize = function(/* container, app */) {
      Ember.Handlebars.helper('time-format', timeFormat);
      Ember.Handlebars.helper('time-ago-in-words', timeAgoInWords);
      Ember.Handlebars.helper('day-of-the-week', dayOfTheWeek);
      Ember.Handlebars.helper('time-ahead-in-words', timeAheadInWords);
      Ember.Handlebars.helper('time-delta-in-words', timeDeltaInWords);
      Ember.Handlebars.helper('month-and-year', monthAndYear);
      Ember.Handlebars.helper('month-and-day', monthAndDay);
      Ember.Handlebars.helper('date-and-time', dateAndTime);
    };
    __exports__.initialize = initialize;
    __exports__["default"] = {
      name: 'ember-cli-dates',
      initialize: initialize
    };
  });
define("frontend/initializers/export-application-global", 
  ["ember","frontend/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal && !window[classifiedName]) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;

    __exports__["default"] = {
      name: 'export-application-global',

      initialize: initialize
    };
  });
define("frontend/initializers/session", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    function initialize(/* container, application */) {
      // application.inject('route', 'foo', 'service:foo');
    }

    __exports__.initialize = initialize;
    var Ember = __dependency1__["default"];

    __exports__["default"] = {
      name: 'session',
      initialize: function(container) {
        Ember.$.ajax({
          url: '/api/sessions/current',
          type: 'GET',
          dataType: "json",
          success: function(data) {
            container.lookup('controller:session').set('currentUser', {
              authenticated: data['authenticated'],
              email: data['email'],
              name: data['name'],
              id: data['id'],
              avatar: data['avatar'],
              token: data['token']
            });
          },
          error: function() {
            console.log('hola guest!');
          }
        });
      }
    };
  });
define("frontend/mixins/reset-scroll", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Mixin.create({
      activate: function() {
        this._super();
        window.scrollTo(0,0);
      }
    });
  });
define("frontend/models/hashtag", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      title: DS.attr('string'),
      stories: DS.hasMany('story' , { async: true }),
      users: DS.hasMany('user' , { async: true }),
      subscribed: DS.attr('boolean')
    });
  });
define("frontend/models/story", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      title: DS.attr('string'),
      body: DS.attr('string'),
      published_at: DS.attr('string'),
      created_at: DS.attr('string'),
      favorites_count: DS.attr('string'),
      subscribed: DS.attr('boolean'),
      hashtag: DS.belongsTo('hashtag', { async: true })
    });
  });
define("frontend/models/user", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      name: DS.attr('string'),
      avatar: DS.attr('string'),
      hashtags: DS.hasMany('hashtag', { async: true })
    });
  });
define("frontend/router", 
  ["ember","frontend/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
      location: config.locationType
    });

    Router.map(function() {
      this.resource("hashtags", function() {
        this.route("show", { path: ":hashtag_id" });
      });
      this.resource("stories", function() {
        this.route("show", { path: ":story_id" });
        this.route("all");    
      });
      this.resource("users", function() {
        this.route("subscribed");
        this.route("signin");
        this.route("signup");
      });
      this.resource("feeds", function() {
        this.route("customize");
        this.route("new");
      });
    });

    __exports__["default"] = Router;
  });
define("frontend/routes/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function(posts, transition) {
        this.transitionTo('stories.all');
      },
      model: function() {
        return Ember.RSVP.hash({
          user: this.store.find('user', 'default_user'),
          stories: this.store.find('story', { subscribed: true })
        });
      },
      setupController: function(controller, modelHash) {
        controller.set('stories', modelHash.stories);
        controller.set('defaultUser', modelHash.user);
      },
      renderTemplate: function(){
        this.render(); // render application template
        this.render('stories.all',{
         into: 'application',
         outlet: 'body'
         });
        this.render('users.subscribed',{
         into: 'application',
         outlet: 'sidebar'
         });
      }
    });
  });
define("frontend/routes/feeds/customize", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function() {
        return this.store.find('hashtag');
      },
      renderTemplate: function() {
        this.render({outlet: 'body',
        controller: 'feeds/customize'
        });
      }
    });
  });
define("frontend/routes/hashtags", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function() {
        return this.store.find('hashtag');
      }
    });
  });
define("frontend/routes/hashtags/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function() {
        return this.store.find('hashtag');
      },
      renderTemplate: function() {
        this.render({outlet: 'sidebar'});
      }
    });
  });
define("frontend/routes/hashtags/show", 
  ["ember","frontend/mixins/reset-scroll","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var resetScrollMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(resetScrollMixin, {
      model: function(params) {
        return this.store.find('hashtag', params.hashtag_id);
      },
      renderTemplate: function() {
        this.render({outlet: 'body'});
      }
    });
  });
define("frontend/routes/stories/all", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({

      renderTemplate: function() {
        this.render('stories.all',{
         into: 'application',
         outlet: 'body',
         controller: 'application'
         });
      }
    });
  });
define("frontend/routes/stories/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function() {
        return this.store.find('story');
      },
      renderTemplate: function() {
        this.render({outlet: 'body'});
      }
    });
  });
define("frontend/routes/users", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      renderTemplate: function() {
        this.render({outlet: 'body'});
      }
    });
  });
define("frontend/routes/users/signin", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      renderTemplate: function() {
        this.render({outlet: 'body'});
      }
    });
  });
define("frontend/routes/users/signup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      renderTemplate: function() {
        this.render({outlet: 'body'});
      },
      setupController: function(controller) {
        controller.set('errors', false);
      }
    });
  });
define("frontend/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n	<div id='flash-wrapper'>\n		<div class='flash-message'>\n			<h3 class='flash-text'>");
      stack1 = helpers._triageMustache.call(depth0, "errors", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h3>\n		</div>\n	</div>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n\n			<div class='user-account'>\n				<img ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'src': ("controllers.session.currentUser.avatar")
      },hashTypes:{'src': "STRING"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" alt=\"avatar\" class='avatar'>\n\n				<p>");
      stack1 = helpers._triageMustache.call(depth0, "controllers.session.currentUser.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n			</div>\n			<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":account-actions actionsVisible")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n				<div class='user-options-wrap'>\n					<a href=\"#\" class='user-link'>\n						<img src=\"/images/edit.png\" alt=\"edit profile\" class='user-option-icons'>\n						<small class='user-option-text'>&nbsp; edit account</small>\n					</a>\n					<a href=\"#\" class='user-link' ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "signOut", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n						<img src=\"/images/sign-out.png\" alt=\"sign out\" class='user-option-icons'>\n						<small class='user-option-text'>&nbsp; sign out</small>\n					</a>\n				</div>\n				<img src=\"/images/expand-down.png\" alt=\"user options\" class='expand-arrow-user'>\n			</div>\n\n		");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n\n			<div class='user-account'>\n				<img src=\"/images/guest-avatar.png\" alt=\"guest\" class='avatar'>\n				<p>Guest</p>\n			</div>\n			<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":account-actions actionsVisible")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n				<div class='user-options-wrap'>\n					");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("user-link")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "users.signin", options) : helperMissing.call(depth0, "link-to", "users.signin", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n					");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("user-link")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "users.signup", options) : helperMissing.call(depth0, "link-to", "users.signup", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n				</div>\n				<img src=\"/images/expand-down.png\" alt=\"user options\" class='expand-arrow-guest'>\n			</div>\n\n		");
      return buffer;
      }
    function program6(depth0,data) {
      
      
      data.buffer.push("\n						<img src=\"/images/sign-in.png\" alt=\"edit profile\" class='user-option-icons'>\n						<small class='user-option-text'>&nbsp; sign in</small>\n					");
      }

    function program8(depth0,data) {
      
      
      data.buffer.push("\n						<img src=\"/images/sign-up.png\" alt=\"sign out\" class='user-option-icons'>\n						<small class='user-option-text'>&nbsp; sign up</small>\n					");
      }

    function program10(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n					");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("outlined button tiny round")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "feeds.customize", options) : helperMissing.call(depth0, "link-to", "feeds.customize", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n				");
      return buffer;
      }
    function program11(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n					  ");
      data.buffer.push(escapeExpression((helper = helpers['fa-icon'] || (depth0 && depth0['fa-icon']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "fa-pencil", options) : helperMissing.call(depth0, "fa-icon", "fa-pencil", options))));
      data.buffer.push("	customize\n					");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "errors", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":app-bar accountVisible")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n	<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":account-box accountVisible")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "optionsShow", {hash:{
        'on': ("mouseEnter")
      },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n\n		");
      stack1 = helpers['if'].call(depth0, "controllers.session.currentUser.authenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n	</div>\n	<div class='logo-bar'>\n		<div class='menu-icon' ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showSidePanel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n			");
      data.buffer.push(escapeExpression((helper = helpers['fa-icon'] || (depth0 && depth0['fa-icon']),options={hash:{
        'size': ("2")
      },hashTypes:{'size': "STRING"},hashContexts:{'size': depth0},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "fa-bars", options) : helperMissing.call(depth0, "fa-icon", "fa-bars", options))));
      data.buffer.push("\n		</div>\n		<h1 class='logo' ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":logo smallLogo")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">Bluebird Feeder</h1>\n	</div>\n\n</div>\n\n<div class='topbar-spacer'>\n	<main>\n		<div ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeSidePanel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n		  <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":side-bar scrollVisible sideVisible")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showScrollbar", {hash:{
        'on': ("mouseEnter")
      },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n\n				");
      stack1 = helpers['if'].call(depth0, "controllers.session.currentUser.authenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n				");
      data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "sidebar", options) : helperMissing.call(depth0, "outlet", "sidebar", options))));
      data.buffer.push("\n\n			</div>\n	  </div>\n\n	  <section ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":main-pane slidePanel")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n	    <div class=\"row\">\n				\n	      ");
      data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "body", options) : helperMissing.call(depth0, "outlet", "body", options))));
      data.buffer.push("\n\n	    </div>\n	  </section>\n\n	</main>\n</div>\n");
      return buffer;
      
    });
  });
define("frontend/templates/components/infinite-scroll", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this;

    function program1(depth0,data) {
      
      var stack1;
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      }

      stack1 = helpers['if'].call(depth0, "isFetching", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("frontend/templates/components/page-numbers", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      <li class=\"arrow prev enabled-arrow\">\n        <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "incrementPage", -1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
      data.buffer.push(">&laquo;</a>\n      </li>\n    ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      <li class=\"arrow prev disabled\">\n        <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "incrementPage", -1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
      data.buffer.push(">&laquo;</a>\n      </li>\n    ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      ");
      stack1 = helpers['if'].call(depth0, "item.current", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      return buffer;
      }
    function program6(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        <li class=\"active page-number\">\n          <a>");
      stack1 = helpers._triageMustache.call(depth0, "item.page", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</a>\n        </li>\n      ");
      return buffer;
      }

    function program8(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        <li class=\"page-number\">\n          <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "pageClicked", "item.page", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "item.page", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</a>\n        </li>\n      ");
      return buffer;
      }

    function program10(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      <li class=\"arrow next enabled-arrow\">\n        <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "incrementPage", 1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
      data.buffer.push(">&raquo;</a>\n      </li>\n    ");
      return buffer;
      }

    function program12(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      <li class=\"arrow next disabled\">\n        <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "incrementPage", 1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
      data.buffer.push(">&raquo;</a>\n      </li>\n    ");
      return buffer;
      }

      data.buffer.push("<div class=\"pagination-centered\">\n  <ul class=\"pagination\">\n    ");
      stack1 = helpers['if'].call(depth0, "canStepBackward", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n    ");
      stack1 = helpers.each.call(depth0, "item", "in", "pageItems", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n    ");
      stack1 = helpers['if'].call(depth0, "canStepForward", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </ul>\n</div>\n");
      return buffer;
      
    });
  });
define("frontend/templates/feeds/customize", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      <p>\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hashtags.show", "", options) : helperMissing.call(depth0, "link-to", "hashtags.show", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </p>\n    ");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n  <div class=\"columns medium-9\">\n    <h2>Search categories</h2>\n    <form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "searchCategories", {hash:{
        'on': ("submit")
      },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n      <div class=\"row collapse postfix-radius\">\n        <div class=\"small-10 columns\">\n          ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("search"),
        'placeholder': ("Search Categories")
      },hashTypes:{'value': "ID",'placeholder': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n        </div>\n        <div class=\"small-2 columns\">\n          <input type=\"submit\" value=\"go!\" class=\"button postfix\" />\n        </div>\n      </div>\n    </form>\n    ");
      stack1 = helpers.each.call(depth0, "results", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  <hr>\n\n  <h2>or add a feed</h2>\n  <p>paste in a url and we'll try to find a feed for you:</p>\n  <form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "addFeed", {hash:{
        'on': ("submit")
      },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <div class=\"row collapse prefix-radius\">\n      <div class=\"small-3 large-2 columns\">\n        <span class=\"prefix\">http://</span>\n      </div>\n      <div class=\"small-9 large-10 columns\">\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("url"),
        'placeholder': ("Enter your URL...")
      },hashTypes:{'value': "ID",'placeholder': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n    </div>\n    <div class=\"row collapse prefix-radius\">\n      <div class=\"small-3 large-2 columns\">\n        <span class=\"prefix\">Category:</span>\n      </div>\n      <div class=\"small-9 large-10 columns\">\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("category"),
        'placeholder': ("Give this feed a category")
      },hashTypes:{'value': "ID",'placeholder': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n    </div>\n    <input type=\"submit\" value=\"Add feed\" class=\"submit button small radius right\" />\n  </form>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("frontend/templates/hashtags/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n  ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("tag-link"),
        'activeClass': ("tag-active"),
        'tagName': ("div")
      },hashTypes:{'class': "STRING",'activeClass': "STRING",'tagName': "STRING"},hashContexts:{'class': depth0,'activeClass': depth0,'tagName': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hashtags.show", "", options) : helperMissing.call(depth0, "link-to", "hashtags.show", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    ");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }

      stack1 = helpers.each.call(depth0, "hashtags", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("frontend/templates/hashtags/show", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "subscribed", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n    <a href=\"#\" class=\"unsubscribe\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "unsubscribe", "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(">Unsubscribe</a>\n  ");
      return buffer;
      }

    function program4(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n    <a href=\"#\" class=\"subscribe\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "subscribe", "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(">Subscribe</a>\n  ");
      return buffer;
      }

    function program6(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n  <div class='article'>\n    <h2>");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n    <p>");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("</p>\n    <small>published ");
      data.buffer.push(escapeExpression((helper = helpers['date-and-time'] || (depth0 && depth0['date-and-time']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "published_at", options) : helperMissing.call(depth0, "date-and-time", "published_at", options))));
      data.buffer.push("</small>\n  </div>\n  <br>\n");
      return buffer;
      }

    function program8(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers.each.call(depth0, "allStories", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }
    function program9(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <div class='article'>\n      <h2>");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n      <p>");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("</p>\n      <small>published ");
      data.buffer.push(escapeExpression((helper = helpers['date-and-time'] || (depth0 && depth0['date-and-time']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "published_at", options) : helperMissing.call(depth0, "date-and-time", "published_at", options))));
      data.buffer.push("</small>\n    </div>\n    <br>\n  ");
      return buffer;
      }

    function program11(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  <div class=\"overflow\">\n    <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "loadAll", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class='load-button'>More Stories</a>\n  </div>\n");
      return buffer;
      }

      data.buffer.push("<div class='row'>\n  <h2 class='category-header'>");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n");
      stack1 = helpers['if'].call(depth0, "controllers.session.currentUser.authenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n</div>\n\n");
      stack1 = helpers.each.call(depth0, "topStories", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = helpers['if'].call(depth0, "showAllStories", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = helpers['if'].call(depth0, "showMoreButton", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("frontend/templates/stories/all", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      <div class='article'>\n        <h2>\n          ");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hashtags.show", "hashtag.id", options) : helperMissing.call(depth0, "link-to", "hashtags.show", "hashtag.id", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        </h2>\n        <p>");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("</p>\n        <small>published ");
      data.buffer.push(escapeExpression((helper = helpers['date-and-time'] || (depth0 && depth0['date-and-time']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "published_at", options) : helperMissing.call(depth0, "date-and-time", "published_at", options))));
      data.buffer.push("</small>\n      </div>\n      <br>\n    ");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("<small class='hashtag-subtitle'>");
      stack1 = helpers._triageMustache.call(depth0, "hashtag.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</small>");
      return buffer;
      }

      data.buffer.push("<h2>&nbsp; All Stories:</h2>\n<div class=\"row\">\n    ");
      stack1 = helpers.each.call(depth0, "pagedContent", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  <div class=\"overflow\">\n    <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "loadNext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class='load-button'>More Stories</a>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("frontend/templates/stories/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <div class='article'>\n      <h2>");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n      <p>");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("</p>\n      <small>published ");
      data.buffer.push(escapeExpression((helper = helpers['date-and-time'] || (depth0 && depth0['date-and-time']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "published_at", options) : helperMissing.call(depth0, "date-and-time", "published_at", options))));
      data.buffer.push("</small>\n    </div>\n    <br>\n  ");
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n  ");
      stack1 = helpers.each.call(depth0, {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
define("frontend/templates/stories/show", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class='row'>\n  <h2>");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n  <p>");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("</p>\n</div>\n");
      return buffer;
      
    });
  });
define("frontend/templates/users", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var stack1;


      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      
    });
  });
define("frontend/templates/users/signin", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


      data.buffer.push("\n<div class='row'>\n\n  <div class='columns medium-8'>\n    <h2>Sign in</h2>\n    <form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "signin", {hash:{
        'on': ("submit")
      },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n\n      <div class=\"field\">\n        <label for=\"user_email\">Email</label><br />\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("email")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n\n      <div class=\"field\">\n        <label for=\"user_password\">Password</label><br />\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("password"),
        'type': ("password")
      },hashTypes:{'value': "ID",'type': "STRING"},hashContexts:{'value': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n\n      <div class=\"actions\">\n        <input type=\"submit\" class=\"tiny button\" value=\"Log in\" />\n      </div>\n    </form>\n\n    <a href=\"/api/users/sign_up\">Sign up</a><br />\n\n    <a href=\"/api/users/password/new\">Forgot your password?</a><br />\n\n    <a href=\"/api/users/confirmation/new\">Didn&#39;t receive confirmation instructions?</a><br />\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("frontend/templates/users/signup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        <small class='errors'>Email ");
      stack1 = helpers._triageMustache.call(depth0, "errors.email", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(".</small>\n        ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          <small class='errors'>Name ");
      stack1 = helpers._triageMustache.call(depth0, "errors.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(".</small>\n        ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        <small class='errors'> Password ");
      stack1 = helpers._triageMustache.call(depth0, "errors.password", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(".</small>\n        ");
      return buffer;
      }

    function program7(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        <small class='errors'> Confirmation ");
      stack1 = helpers._triageMustache.call(depth0, "errors.password_confirmation", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(".</small>\n        ");
      return buffer;
      }

      data.buffer.push("\n<div class='row'>\n  <div class='columns medium-8'>\n    <h2>Sign up</h2>\n    <form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "signup", {hash:{
        'on': ("submit")
      },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n\n      <div class=\"field\">\n        <label for=\"user_email\">Email</label>\n        ");
      stack1 = helpers['if'].call(depth0, "errors.email", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("email")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n\n      <div class=\"field\">\n        <label for=\"user_name\">Name</label>\n        ");
      stack1 = helpers['if'].call(depth0, "errors.name", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("name")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n\n      <div class=\"field\">\n        <label for=\"user_password\">Password</label>\n        ");
      stack1 = helpers['if'].call(depth0, "errors.password", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("password"),
        'type': ("password")
      },hashTypes:{'value': "ID",'type': "STRING"},hashContexts:{'value': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n\n      <div class=\"field\">\n        <label for=\"user_password_confirmation\">Confirm Password</label>\n        ");
      stack1 = helpers['if'].call(depth0, "errors.password_confirmation", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("passwordConfirmation"),
        'type': ("password")
      },hashTypes:{'value': "ID",'type': "STRING"},hashContexts:{'value': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n\n      <div class=\"actions\">\n        <input type=\"submit\" class=\"tiny button\" value=\"Sign up\" />\n      </div>\n    </form>\n\n    <a href=\"/api/users/sign_in\">Log in</a><br />\n    <a href=\"/api/users/confirmation/new\">Didn&#39;t receive confirmation instructions?</a><br />\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("frontend/templates/users/subscribed", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("All");
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n  ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("tag-link"),
        'activeClass': ("tag-active"),
        'tagName': ("div")
      },hashTypes:{'class': "STRING",'activeClass': "STRING",'tagName': "STRING"},hashContexts:{'class': depth0,'activeClass': depth0,'tagName': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hashtags.show", "", options) : helperMissing.call(depth0, "link-to", "hashtags.show", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }
    function program4(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    ");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }

      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("tag-link"),
        'activeClass': ("tag-active"),
        'tagName': ("div")
      },hashTypes:{'class': "STRING",'activeClass': "STRING",'tagName': "STRING"},hashContexts:{'class': depth0,'activeClass': depth0,'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "stories.all", options) : helperMissing.call(depth0, "link-to", "stories.all", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      stack1 = helpers.each.call(depth0, "defaultUser.hashtags", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("frontend/tests/adapters/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/application.js should pass jshint', function() { 
      ok(true, 'adapters/application.js should pass jshint.'); 
    });
  });
define("frontend/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("frontend/tests/controllers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/application.js should pass jshint', function() { 
      ok(true, 'controllers/application.js should pass jshint.'); 
    });
  });
define("frontend/tests/controllers/feeds/customize.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/feeds');
    test('controllers/feeds/customize.js should pass jshint', function() { 
      ok(true, 'controllers/feeds/customize.js should pass jshint.'); 
    });
  });
define("frontend/tests/controllers/hashtags/show.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/hashtags');
    test('controllers/hashtags/show.js should pass jshint', function() { 
      ok(true, 'controllers/hashtags/show.js should pass jshint.'); 
    });
  });
define("frontend/tests/controllers/session.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/session.js should pass jshint', function() { 
      ok(true, 'controllers/session.js should pass jshint.'); 
    });
  });
define("frontend/tests/controllers/stories/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/stories');
    test('controllers/stories/index.js should pass jshint', function() { 
      ok(true, 'controllers/stories/index.js should pass jshint.'); 
    });
  });
define("frontend/tests/controllers/users/signin.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/users');
    test('controllers/users/signin.js should pass jshint', function() { 
      ok(true, 'controllers/users/signin.js should pass jshint.'); 
    });
  });
define("frontend/tests/controllers/users/signup.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/users');
    test('controllers/users/signup.js should pass jshint', function() { 
      ok(true, 'controllers/users/signup.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/helpers');
    test('frontend/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'frontend/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/helpers');
    test('frontend/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'frontend/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests');
    test('frontend/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'frontend/tests/test-helper.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/controllers/current-user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/controllers');
    test('frontend/tests/unit/controllers/current-user-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/controllers/current-user-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/controllers/hashtags-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/controllers');
    test('frontend/tests/unit/controllers/hashtags-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/controllers/hashtags-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/controllers/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/controllers');
    test('frontend/tests/unit/controllers/index-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/controllers/index-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/controllers/stories-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/controllers');
    test('frontend/tests/unit/controllers/stories-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/controllers/stories-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/controllers/token-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/controllers');
    test('frontend/tests/unit/controllers/token-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/controllers/token-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/controllers/users-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/controllers');
    test('frontend/tests/unit/controllers/users-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/controllers/users-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/helpers/autocomplete-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/helpers');
    test('frontend/tests/unit/helpers/autocomplete-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/helpers/autocomplete-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/initializers/csrf-token-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/initializers');
    test('frontend/tests/unit/initializers/csrf-token-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/initializers/csrf-token-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/initializers/current-user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/initializers');
    test('frontend/tests/unit/initializers/current-user-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/initializers/current-user-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/mixins/infinite-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/mixins');
    test('frontend/tests/unit/mixins/infinite-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/mixins/infinite-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/mixins/reset-scroll-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/mixins');
    test('frontend/tests/unit/mixins/reset-scroll-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/mixins/reset-scroll-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/models/feed-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/models');
    test('frontend/tests/unit/models/feed-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/models/feed-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/models/hashtag-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/models');
    test('frontend/tests/unit/models/hashtag-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/models/hashtag-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/models/user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/models');
    test('frontend/tests/unit/models/user-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/models/user-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/routes/users-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/routes');
    test('frontend/tests/unit/routes/users-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/routes/users-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/views/autocomplete-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/views');
    test('frontend/tests/unit/views/autocomplete-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/views/autocomplete-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/frontend/tests/unit/views/stories-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/views');
    test('frontend/tests/unit/views/stories-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/views/stories-test.js should pass jshint.'); 
    });
  });
define("frontend/tests/helpers/resolver", 
  ["ember/resolver","frontend/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("frontend/tests/helpers/start-app", 
  ["ember","frontend/app","frontend/router","frontend/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var application;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function() {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });
define("frontend/tests/initializers/session.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - initializers');
    test('initializers/session.js should pass jshint', function() { 
      ok(true, 'initializers/session.js should pass jshint.'); 
    });
  });
define("frontend/tests/mixins/reset-scroll.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - mixins');
    test('mixins/reset-scroll.js should pass jshint', function() { 
      ok(true, 'mixins/reset-scroll.js should pass jshint.'); 
    });
  });
define("frontend/tests/models/hashtag.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/hashtag.js should pass jshint', function() { 
      ok(true, 'models/hashtag.js should pass jshint.'); 
    });
  });
define("frontend/tests/models/story.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/story.js should pass jshint', function() { 
      ok(true, 'models/story.js should pass jshint.'); 
    });
  });
define("frontend/tests/models/user.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/user.js should pass jshint', function() { 
      ok(true, 'models/user.js should pass jshint.'); 
    });
  });
define("frontend/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/application.js should pass jshint', function() { 
      ok(false, 'routes/application.js should pass jshint.\nroutes/application.js: line 4, col 32, \'transition\' is defined but never used.\nroutes/application.js: line 4, col 25, \'posts\' is defined but never used.\n\n2 errors'); 
    });
  });
define("frontend/tests/routes/feeds/customize.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/feeds');
    test('routes/feeds/customize.js should pass jshint', function() { 
      ok(true, 'routes/feeds/customize.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/hashtags.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/hashtags.js should pass jshint', function() { 
      ok(true, 'routes/hashtags.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/hashtags/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/hashtags');
    test('routes/hashtags/index.js should pass jshint', function() { 
      ok(true, 'routes/hashtags/index.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/hashtags/show.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/hashtags');
    test('routes/hashtags/show.js should pass jshint', function() { 
      ok(true, 'routes/hashtags/show.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/stories/all.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/stories');
    test('routes/stories/all.js should pass jshint', function() { 
      ok(true, 'routes/stories/all.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/stories/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/stories');
    test('routes/stories/index.js should pass jshint', function() { 
      ok(true, 'routes/stories/index.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/users.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/users.js should pass jshint', function() { 
      ok(true, 'routes/users.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/users/signin.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/users');
    test('routes/users/signin.js should pass jshint', function() { 
      ok(true, 'routes/users/signin.js should pass jshint.'); 
    });
  });
define("frontend/tests/routes/users/signup.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/users');
    test('routes/users/signup.js should pass jshint', function() { 
      ok(true, 'routes/users/signup.js should pass jshint.'); 
    });
  });
define("frontend/tests/test-helper", 
  ["frontend/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

    QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
    var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
    document.getElementById('ember-testing-container').style.visibility = containerVisibility;
  });
define("frontend/tests/unit/controllers/current-user-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:current-user', 'CurrentUserController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("frontend/tests/unit/controllers/hashtags-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:hashtags', 'HashtagsController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("frontend/tests/unit/controllers/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:index', 'IndexController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("frontend/tests/unit/controllers/stories-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:stories', 'StoriesController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("frontend/tests/unit/controllers/token-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:token', 'TokenController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("frontend/tests/unit/controllers/users-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:users', 'UsersController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("frontend/tests/unit/helpers/autocomplete-test", 
  ["frontend/helpers/autocomplete"],
  function(__dependency1__) {
    "use strict";
    var autocomplete = __dependency1__.autocomplete;

    module('AutocompleteHelper');

    // Replace this with your real tests.
    test('it works', function() {
      var result = autocomplete(42);
      ok(result);
    });
  });
define("frontend/tests/unit/initializers/csrf-token-test", 
  ["ember","frontend/initializers/csrf-token"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var initialize = __dependency2__.initialize;

    var container, application;

    module('CsrfTokenInitializer', {
      setup: function() {
        Ember.run(function() {
          application = Ember.Application.create();
          container = application.__container__;
          application.deferReadiness();
        });
      }
    });

    // Replace this with your real tests.
    test('it works', function() {
      initialize(container, application);

      // you would normally confirm the results of the initializer here
      ok(true);
    });
  });
define("frontend/tests/unit/initializers/current-user-test", 
  ["ember","frontend/initializers/current-user"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var initialize = __dependency2__.initialize;

    var container, application;

    module('CurrentUserInitializer', {
      setup: function() {
        Ember.run(function() {
          application = Ember.Application.create();
          container = application.__container__;
          application.deferReadiness();
        });
      }
    });

    // Replace this with your real tests.
    test('it works', function() {
      initialize(container, application);

      // you would normally confirm the results of the initializer here
      ok(true);
    });
  });
define("frontend/tests/unit/mixins/infinite-test", 
  ["ember","frontend/mixins/infinite"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var InfiniteMixin = __dependency2__["default"];

    module('InfiniteMixin');

    // Replace this with your real tests.
    test('it works', function() {
      var InfiniteObject = Ember.Object.extend(InfiniteMixin);
      var subject = InfiniteObject.create();
      ok(subject);
    });
  });
define("frontend/tests/unit/mixins/reset-scroll-test", 
  ["ember","frontend/mixins/reset-scroll"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ResetScrollMixin = __dependency2__["default"];

    module('ResetScrollMixin');

    // Replace this with your real tests.
    test('it works', function() {
      var ResetScrollObject = Ember.Object.extend(ResetScrollMixin);
      var subject = ResetScrollObject.create();
      ok(subject);
    });
  });
define("frontend/tests/unit/models/feed-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel('feed', 'Feed', {
      // Specify the other units that are required for this test.
      needs: []
    });

    test('it exists', function() {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("frontend/tests/unit/models/hashtag-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel('hashtag', 'Hashtag', {
      // Specify the other units that are required for this test.
      needs: []
    });

    test('it exists', function() {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("frontend/tests/unit/models/user-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel('user', 'User', {
      // Specify the other units that are required for this test.
      needs: []
    });

    test('it exists', function() {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("frontend/tests/unit/routes/users-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:users', 'UsersRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("frontend/tests/unit/views/autocomplete-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('view:autocomplete', 'AutocompleteView');

    // Replace this with your real tests.
    test('it exists', function() {
      var view = this.subject();
      ok(view);
    });
  });
define("frontend/tests/unit/views/stories-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('view:stories', 'StoriesView');

    // Replace this with your real tests.
    test('it exists', function() {
      var view = this.subject();
      ok(view);
    });
  });
/* jshint ignore:start */

define('frontend/config/environment', ['ember'], function(Ember) {
  return { 'default': {"modulePrefix":"frontend","environment":"development","baseURL":"/","locationType":"auto","EmberENV":{"FEATURES":{}},"APP":{},"contentSecurityPolicyHeader":"Content-Security-Policy-Report-Only","contentSecurityPolicy":{"default-src":"'none'","script-src":"'self' 'unsafe-eval'","font-src":"'self'","connect-src":"'self'","img-src":"'self'","style-src":"'self'","media-src":"'self'"},"exportApplicationGlobal":true}};
});

if (runningTests) {
  require("frontend/tests/test-helper");
} else {
  require("frontend/app")["default"].create({});
}

/* jshint ignore:end */
//# sourceMappingURL=frontend.map