app.controller('appCtrl', function($scope, $http, $routeParams, $location, socket, Data) {

    $scope.hash = '';
    $scope.warning = false;
    $scope.warningMessage = '';
    $scope.pincode = '';
    $scope.qrRead = false;

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
            console.log();
            socket.emit('transferID', {hash: $scope.hash, ID: $scope.pincode});
        }
    };

    const joinFailure = function() {
        $scope.warning = true;
        $scope.warningMessage = "Invalid Device Number: Device is not registered on the system. Please connect the device to the system first.";
        console.log('No device');
        $scope.currStatus = 0;
        $scope.$apply();

        /* Handle device not currently waiting on connection */
    };

    socket.removeAllListeners('joinFailure', function() {
        socket.once('joinFailure', joinFailure);
    });

    const pollWait= function() {
        $scope.currStatus = 2;
        $scope.$apply();
        /* Device is on the network, waiting for button presses */
        console.log('Device present, press button');
    };

    socket.removeAllListeners('pollWait', function() {
        socket.once('pollWait', pollWait);
    });

    const btnSyncHash = function () {
        console.log('Button has been synched');

        $scope.currStatus = 3;
        $scope.$apply();
        /* */
    };

    socket.removeAllListeners('btnSyncHash', function() {
        socket.once('btnSyncHash', btnSyncHash);
    });

    /* Entry remapping */
    let tmp = $routeParams.hash;

    if (tmp !== 'home') {
        $scope.hash = tmp;
        socket.emit('joinRoom', {ID: $scope.hash});
        console.log(tmp);
        $location.url('/app/home');
    }

    $scope.openCamera = () => {
        $scope.qrRead = true;
    };

    $('#reader').html5_qrcode(function(data){
        console.log(data);
        if ($scope.qrRead) {
            $scope.pincode = '';
            $scope.qrRead = false;
            $scope.currStatus = 1;
            $scope.$apply();

            console.log(data);
            socket.emit('transferID', {hash: $scope.hash, ID: data});
        }
    }, function(error){
        //show read errors
    }, function(videoError){
        //the video stream could be opened
    });


    $scope.closeCamera = () => {
        $scope.qrRead = false;
    };

});
