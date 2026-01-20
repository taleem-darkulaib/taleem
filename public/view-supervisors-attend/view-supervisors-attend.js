application.controllerProvider.register("view-supervisors-attend", ($scope, $timeout) => {
	
	$scope.supervisors = new Array();
	$scope.supervisor = new Object();
	$scope.supervisorsAttend = new Object();
	$scope.attendance = new Object();
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArray("supervisors", supervisors => {
		$scope.supervisors = supervisors;
	});

	$scope.getBySemester("supervisors-attend", supervisorsAttend =>{
		
		$scope.supervisorsAttend = supervisorsAttend;
		
		$scope.attendance = $scope.calculateMemberAttendance(supervisorsAttend);
	});

	$scope.selectSupervisor = supervisor => {
		$scope.supervisor = supervisor;
	}
});