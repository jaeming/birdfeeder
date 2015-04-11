import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("hashtags", function() {
    this.route("show", { path: ":title" });
  });
  this.resource("stories", function() {
    this.route("show", { path: ":id" });
    this.route("favorites");
    this.route("subscribed");
  });
  this.resource("users", function() {
    this.route("edit");
    this.route("signin");
    this.route("signup");
  });
  this.resource("feeds", function() {
    this.route("customize");
    this.route("new");
  });
});

export default Router;