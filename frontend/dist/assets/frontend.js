define("frontend/adapters/application", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.RESTAdapter.extend({
        coalesceFindRequests: true,
        namespace: 'api'
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

    __exports__["default"] = Ember.Controller.extend({
      needs: ['session']
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
              id: data['id']
            });
          },
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
      this.resource('hashtags', function() {
        this.route('show', {path: ':hashtag_id'});
      });
    });

    __exports__["default"] = Router;
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
define("frontend/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      Hi, ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.session.currentUser.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      return buffer;
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n      Hello, Guest\n    ");
      }

      data.buffer.push("<div class=\"row\">\n  <div class=\"margin-top\">\n    <h1 id=\"title\">BirdFeeder</h1>\n  </div>\n  <p>\n    ");
      stack1 = helpers['if'].call(depth0, "controllers.session.currentUser", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </p>\n</div>\n\n  ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
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
      data.buffer.push("\n      <h5>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hashtags.show", "", options) : helperMissing.call(depth0, "link-to", "hashtags.show", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h5>\n    ");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("#");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      }

      data.buffer.push("<div class='row'>\n    ");
      stack1 = helpers.each.call(depth0, {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
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
      var buffer = '', stack1;


      data.buffer.push("<h2>#");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n");
      return buffer;
      
    });
  });
define("frontend/templates/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"row\">\n  <p>\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </p>\n  ");
      data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("button radius")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Hashtags", "hashtags", options) : helperMissing.call(depth0, "link-to", "Hashtags", "hashtags", options))));
      data.buffer.push("\n</div>\n");
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
define("frontend/tests/frontend/tests/unit/initializers/current-user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - frontend/tests/unit/initializers');
    test('frontend/tests/unit/initializers/current-user-test.js should pass jshint', function() { 
      ok(true, 'frontend/tests/unit/initializers/current-user-test.js should pass jshint.'); 
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
define("frontend/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
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