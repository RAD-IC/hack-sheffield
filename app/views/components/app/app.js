app.controller('appCtrl', function($scope, $http, $routeParams, $location, socket, Data) {
    $scope.hash = '';
    $scope.warning = false;
    $scope.warningMessage = '';
    $scope.pincode = '';
    $scope.sentData = false;
    $scope.validData = false;
    $scope.sendPin = () => {
      let val = $scope.pincode;
      let isnum = /^\d+$/.test(val);
      if (!isnum) {
        $scope.warning = true;
        $scope.warningMessage = "Invalid Device Number: Device number must only contain numbers.";
      } else {
        $scope.sentData = true;
        socket.emit('transferID', {hash: $scope.hash, ID: $scope.pincode});
      }
    };

    socket.on('joinFailure', () => {
        $scope.sentData = false;
        $scope.warning = true;
        $scope.warningMessage = "Invalid Device Number: Device is not registered on the system. Please connect the device to the system first.";
        console.log('No device');

        /* Handle device not currently waiting on connection */
    });

    socket.on('pollWait', (data) => {
        /* Device is on the network, waiting for button presses */
        console.log('Device present, press button');

    });

    /* Entry remapping */
    let tmp = $routeParams.hash;

    if (tmp !== 'home') {
        $scope.hash = tmp;
        console.log(tmp);
        $location.url('/app/home');
    }
});
