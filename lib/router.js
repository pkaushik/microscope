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
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() { 
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {
  name: 'postSubmit'
});

PostsListController = RouteController.extend({
  _increment: 5, 
  _postsLimit: function() { 
    return parseInt(this.params._limit) || this._increment; 
  },
  _findOptions: function() {
    return {sort: {submitted: -1}, limit: this._postsLimit()};
  },
  _posts: function() {
    return Posts.find({}, this._findOptions());
  },
  template: 'postsList',
  subscriptions: function() {
    this._postsSub = Meteor.subscribe('posts', this._findOptions());
  },
  data: function() {
    var hasMore = this._posts().count() === this._postsLimit();
    var nextPath = this.route.path({
      _limit: this._postsLimit() + this._increment
    });
    return {
      posts: this._posts(),
      ready: this._postsSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});

Router.route('/:_limit?', {
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