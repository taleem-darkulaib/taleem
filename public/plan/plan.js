application.controllerProvider.register("plan", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.levelsCourses = new Object();
	$scope.rooms = new Array();
	$scope.teachers = new Array();
	$scope.plan = new Object();
	
	$scope.getActiveArray("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {
		
		$scope.levels = levels;
		
		$scope.updateLevelsCourses();
	});
	
	$scope.getActiveArray("courses", courses => {

		$scope.courses = courses;
		
		$scope.updateLevelsCourses();
	});
		
	$scope.getBySemester("levels-courses", levelsCourses => {
		
		$scope.levelsCourses = levelsCourses;

		$scope.updateLevelsCourses();
	});
	
	$scope.updateLevelsCourses = () => {
		
		$scope.levels.forEach(level => level.courses = $scope.courses.filter(course => $scope.levelsCourses[level.id] != null 
																						&& $scope.levelsCourses[level.id].includes(course.id)));
	}
	
	$scope.getActiveArray("rooms", rooms => {
		$scope.rooms = rooms;
	});
	
	$scope.getActiveArray("teachers", teachers => {
		$scope.teachers = teachers;
	});

	$scope.getBySemester("plan", plan => {
		$scope.plan = plan;
	});
	
	$scope.savePlan = () => {
		
		$scope.saveBySemester("plan", $scope.plan, "تم حفظ الخطة بنجاح");
	}
});