app.controller('appCtrl', function($scope, $http, $routeParams, $location, socket, Data) {

    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (content) {
      console.log(content);
    });
    Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      console.error('No cameras found.');
    }
    }).catch(function (e) {
      console.error(e);
    });

    $scope.hash = '';
    $scope.warning = false;
    $scope.warningMessage = '';
    $scope.pincode = '';

    $scope.currStatus = 0;

    /* need id input -> 0, checking id -> 1, waiting for btn -> 2, success -> 3 */
    $scope.sendPin = () => {
      let val = $scope.pincode;
      let isnum = /^\d+$/.test(val);
      if (!isnum) {
        $scope.warning = true;
        $scope.warningMessage = "Invalid Device Number: Device number must only contain numbers.";
      } else {
        $scope.currStatus = 1;
        socket.emit('transferID', {hash: $scope.hash, ID: $scope.pincode});
      }
    };

    socket.on('joinFailure', () => {
        $scope.warning = true;
        $scope.warningMessage = "Invalid Device Number: Device is not registered on the system. Please connect the device to the system first.";
        console.log('No device');
        $scope.currStatus = 0;

        /* Handle device not currently waiting on connection */
    });

    socket.on('pollWait', (data) => {
        $scope.currStatus = 2;
        /* Device is on the network, waiting for button presses */
        console.log('Device present, press button');
    });
    
    /* TODO set statte to 3 when the device button is pressed */

    /* Entry remapping */
    let tmp = $routeParams.hash;

    if (tmp !== 'home') {
        $scope.hash = tmp;
        console.log(tmp);
        $location.url('/app/home');
    }
});
