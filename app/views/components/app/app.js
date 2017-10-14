app.controller('appCtrl', function($scope, $http, $routeParams, socket, Data) {
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
        $scope.warning = true;
        $scope.warningMessage = "Invalid Device Number: Device is not registered on the system. Please connect the device to the system first.";
        $scope.sentData = true;
      }
    }
});
