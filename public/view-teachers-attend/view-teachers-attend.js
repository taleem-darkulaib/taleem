application.controllerProvider.register("view-teachers-attend", ($scope, $timeout) => {
	
	$scope.teachers = new Array();
	$scope.attendance = new Object();
	$scope.teacher = new Object();
	$scope.teachersAttend = new Object();
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArray("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getBySemester("teachers-attend", teachersAttend =>{
		
		$scope.teachersAttend = teachersAttend;
		
		$scope.attendance = $scope.calculateMemberAttendance(teachersAttend);
	});
	
	$scope.selectTeacher = teacher => {
		$scope.teacher = teacher;
	}
});