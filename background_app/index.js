const notifier = require('node-notifier');
const path = require('path');

notifier.notify({
  title: 'Someone is knocking on your door!',
  message: 'You might want to open the door',
  icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
  sound: true, // Only Notification Center or Windows Toasters
  wait: true // Wait with callback, until user action is taken against notification
}, function (err, response) {
  // Response is response from notification
});

notifier.on('click', function (notifierObject, options) {
  // Triggers if `wait: true` and user clicks notification
});

notifier.on('timeout', function (notifierObject, options) {
  // Triggers if `wait: true` and notification closes
});
