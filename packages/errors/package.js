Package.describe({
  name: 'pkaushik:errors',
  version: '1.0.0',
  summary: 'A pattern to display application errors to the user',
  git: '',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
  api.addFiles(['errors.js', 'errors_list.html', 'errors_list.js'], 'client');
  api.export('Errors');
});

Package.onTest(function(api) {
  api.use('pkaushik:errors', 'client');
  api.use(['tinytest', 'test-helpers', 'templating'], 'client');  
  api.addFiles('errors_tests.js', 'client');
});