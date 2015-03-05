import Ember from "ember";
import config from "./config/environment";

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
    this.route("signup");    
  });
});

export default Router;
