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
define("frontend/controllers/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({
      needs: ['session'],
    	actionsVisible: false,
    	accountVisible: false,
    	smallLogo: false,
    	scrollVisible: false,
      sideVisible: false,
      slidePanel: false,
    	actions: {
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
define("frontend/controllers/signin", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      actions: {
        signin: function() {
          var _this = this;
          var email = this.get('email');
          var password = this.get('email');

          Ember.$.ajax({
            url : 'api/users/sign_in',
            type: 'POST',
            dataType : "json",
            data: {"user":{"email": email, "password": password}},

            success: function(data) {
              console.log(data);
              // probably need to bind something here
              _this.transitionToRoute('/');
            },
            error: function() {
              //need an error message with response data here.
              //alert in the meantime:
              alert('sign in failed');
            }
          });
        }
      }
    });
  });
define("frontend/controllers/users/signin", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      actions: {
        signin: function() {
          var _this = this;
          var email = this.get('email');
          var password = this.get('email');

          Ember.$.ajax({
            url : 'api/users/sign_in',
            type: 'POST',
            dataType : "json",
            data: {"user":{"email": email, "password": password}},

            success: function(data) {
              console.log(data);
              // probably need to bind something here
              _this.transitionToRoute('/');
            },
            error: function() {
              //need an error message with response data here.
              //alert in the meantime:
              alert('sign in failed');
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
          success:function(data) {
            container.lookup('controller:session').set('currentUser', {
              email: data['email'],
              name: data['name'],
              id: data['id'],
              avatar: data['avatar']
            });
          },
          error:function() {
            console.log('hola guest!');
          }
        });
      }
    };
  });
define("frontend/models/hashtag", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      title: DS.attr('string'),
      stories: DS.hasMany('story' , { async: true })
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
      email: DS.attr('string'),
      avatar: DS.attr('string')
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
      this.resource("hashtags", {
        path: "/"
      }, function() {
        this.route("show", { path: ":hashtag_id" });
      });
      this.resource("stories", function() {
        this.route("show", { path: ":story_id" });
      });
      this.resource("users", function() {
        this.route("signin");
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
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function(params) {
        return this.store.find('hashtag', params.hashtag_id);
      },
      renderTemplate: function() {
        this.render({outlet: 'body'});
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
      data.buffer.push(">\n				<div class='user-options-wrap'>\n					<a href=\"#\" class='user-link'>\n						<img src=\"./images/edit-profile.png\" alt=\"edit profile\" class='user-option-icons'>\n						<small class='user-option-text'>&nbsp; edit account</small>\n					</a>\n					<a href=\"#\" class='user-link'>\n						<img src=\"./images/sign-out.png\" alt=\"sign out\" class='user-option-icons'>\n						<small class='user-option-text'>&nbsp; sign out</small>\n					</a>\n				</div>\n				<img src=\"./images/expand-down.png\" alt=\"user options\" class='expand-arrow-user'>\n			</div>\n\n		");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n\n			<div class='user-account'>\n				<img src=\"./images/guest-avatar.png\" alt=\"guest\" class='avatar'>\n				<p>Guest</p>\n			</div>\n			<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":account-actions actionsVisible")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n				<div class='user-options-wrap'>\n					");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("user-link")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "users.signin", options) : helperMissing.call(depth0, "link-to", "users.signin", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n					<a href=\"#\" class='user-link'>\n						<img src=\"./images/sign-up.png\" alt=\"sign out\" class='user-option-icons'>\n						<small class='user-option-text'>&nbsp; sign up</small>\n					</a>\n				</div>\n				<img src=\"./images/expand-down.png\" alt=\"user options\" class='expand-arrow-guest'>\n			</div>\n\n		");
      return buffer;
      }
    function program4(depth0,data) {
      
      
      data.buffer.push("\n						<img src=\"./images/sign-in.png\" alt=\"edit profile\" class='user-option-icons'>\n						<small class='user-option-text'>&nbsp; sign in</small>\n					");
      }

    function program6(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n		      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("tag-link"),
        'activeClass': ("tag-active"),
        'tagName': ("div")
      },hashTypes:{'class': "STRING",'activeClass': "STRING",'tagName': "STRING"},hashContexts:{'class': depth0,'activeClass': depth0,'tagName': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hashtags.show", "", options) : helperMissing.call(depth0, "link-to", "hashtags.show", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n		    ");
      return buffer;
      }
    function program7(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n						");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n					");
      return buffer;
      }

      data.buffer.push("<div ");
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
      stack1 = helpers['if'].call(depth0, "controllers.session.currentUser", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
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
      stack1 = helpers.each.call(depth0, {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n			</div>\n	  </div>\n\n	  <section ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":main-pane slidePanel")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n	    <div class=\"row\">\n\n	      ");
      data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "body", options) : helperMissing.call(depth0, "outlet", "body", options))));
      data.buffer.push("\n\n	    </div>\n	  </section>\n\n	</main>\n</div>\n");
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
      data.buffer.push("\n  <h5>\n    ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hashtags.show", "", options) : helperMissing.call(depth0, "link-to", "hashtags.show", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </h5>\n");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push(" ");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      return buffer;
      }

      stack1 = helpers.each.call(depth0, {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data});
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
      var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n\n  <div class='article'>\n    <h2>");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n    <p>");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("</p>\n    <small>published ");
      data.buffer.push(escapeExpression((helper = helpers['date-and-time'] || (depth0 && depth0['date-and-time']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "published_at", options) : helperMissing.call(depth0, "date-and-time", "published_at", options))));
      data.buffer.push("</small>\n  </div>\n  <br>\n\n");
      return buffer;
      }

      data.buffer.push("<div class='row'>\n  <h2>&nbsp; ");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n</div>\n\n");
      stack1 = helpers.each.call(depth0, "stories", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
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
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    <h2>");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n    <p>");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("</p>\n    <small>");
      stack1 = helpers._triageMustache.call(depth0, "published_at", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</small>\n    <hr>\n    <hr>\n  ");
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n  ");
      stack1 = helpers.each.call(depth0, {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>");
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


      data.buffer.push("\n<div class='row'>\n\n  <div class='columns medium-8'>\n    <h2>Log in</h2>\n    <form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "signin", {hash:{
        'on': ("submit")
      },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n\n\n\n\n\n      <div class=\"field\">\n        <label for=\"user_email\">Email</label><br />\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("email")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n\n      <div class=\"field\">\n        <label for=\"user_password\">Password</label><br />\n        ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("password"),
        'type': ("password")
      },hashTypes:{'value': "ID",'type': "STRING"},hashContexts:{'value': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n      </div>\n\n\n\n      <div class=\"actions\">\n        <input type=\"submit\" class=\"tiny button\" value=\"Log in\" />\n      </div>\n    </form>\n\n    <a href=\"/api/users/sign_up\">Sign up</a><br />\n\n    <a href=\"/api/users/password/new\">Forgot your password?</a><br />\n\n    <a href=\"/api/users/confirmation/new\">Didn&#39;t receive confirmation instructions?</a><br />\n  </div>\n</div>");
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
define("frontend/tests/controllers/session.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/session.js should pass jshint', function() { 
      ok(true, 'controllers/session.js should pass jshint.'); 
    });
  });
define("frontend/tests/controllers/signin.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/signin.js should pass jshint', function() { 
      ok(true, 'controllers/signin.js should pass jshint.'); 
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
define("frontend/tests/frontend/tests/unit/controllers/users-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/controllers');
    test('frontend/tests/unit/controllers/users-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/controllers/users-test.js should pass jshint.'); 
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
      ok(true, 'routes/application.js should pass jshint.'); 
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