Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [
      Meteor.subscribe('notifications')
    ]; 
  }
});

// Router.route('/', {
//   name: 'postsList'
// });

Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return Meteor.subscribe('comments', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {
  name: 'postSubmit'
});

PostsListController = RouteController.extend({
  _increment: 5, 
  _postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this._increment; 
  },
  _findOptions: function() {
    return {sort: {submitted: -1}, limit: this._postsLimit()};
  },
  _posts: function() {
    return Posts.find({}, this._findOptions());
  },
  template: 'postsList',
  waitOn: function() {
    return Meteor.subscribe('posts', this._findOptions());
  },
  subscriptions: function() {
    this._postsSub = Meteor.subscribe('posts', this._findOptions());
  },
  data: function() {
    var hasMore = this._posts().count() === this._postsLimit();
    var nextPath = this.route.path({
      postsLimit: this._postsLimit() + this._increment
    });
    return {
      posts: this._posts(),
      nextPath: hasMore ? nextPath : null
    };
  }
});

Router.route('/:postsLimit?', {
  name: 'postsList'
});



var requireLogin = function() {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}



Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});