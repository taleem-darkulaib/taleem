application.controllerProvider.register("levels-students", ($scope, $timeout) => {
	
	$scope.rooms = new Object();
	$scope.courses = new Array();
	$scope.teachers = new Object();
	$scope.levels = new Object();
	$scope.students = new Array();
	$scope.levelStudents = new Array();
	$scope.plan = new Object();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.levelPlan = new Object();
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});

	$scope.get("nights", nights => {
		$scope.nights = nights;
	});
	
	$scope.get("rooms", rooms => {
		$scope.rooms = rooms;
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.get("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.getArrayBySemester("students", students => {
		$scope.students = students;
		$scope.updateLevel();
	});

	$scope.getBySemester("plan", plan => {
		$scope.plan = $scope.copy(plan);
		$scope.updateLevel();
	});
	
	$scope.updateLevel = () => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);

			$scope.levelStudents = $scope.students.filter(student => student.level == $scope.level);
			
			$scope.levelPlan = $scope.copy($scope.plan[$scope.level]);
		}
	}
});