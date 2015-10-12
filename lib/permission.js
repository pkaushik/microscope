// global permission check that the userId specified owns the given document (post/notification)
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}