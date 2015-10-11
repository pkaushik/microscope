Template.commentSubmit.onCreated(function() {
  Session.set('commentSubmitErrors', {});
});

Template.commentSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('commentSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();
    Session.set('commentSubmitErrors', {});

    var $body = $(e.target).find('[name=body]');
    var comment = {
      body: $body.val(),
      postId: template.data._id
    };

    var errors = {};
    if (! comment.body) {
      errors.body = 'Please write some content';
      Session.set('commentSubmitErrors', errors);
      return;
    }

    Meteor.call('commentInsert', comment, function(error, commentId) {
      if (error){
        Errors.throw(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});