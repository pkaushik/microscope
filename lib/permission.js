// global permission check that the userId specified owns the given post
ownsPost = function(userId, post) {
  return post && post.userId === userId;
}