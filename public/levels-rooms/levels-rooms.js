application.controllerProvider.register("levels-rooms", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.rooms = new Array();
	$scope.levelsRooms = new Object();
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getActiveArray("rooms", rooms => {
		$scope.rooms = rooms;
	});
	
	$scope.getBySemester("levels-rooms", levelsRooms => {
		$scope.levelsRooms = levelsRooms;
	});

	$scope.saveLevelsRooms = () =>{
		
		$scope.saveBySemester("levels-rooms", $scope.levelsRooms, "تم حفظ غرف " + $scope.labels.levels + " بنجاح");
	}
});