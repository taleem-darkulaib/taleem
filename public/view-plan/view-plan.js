application.controllerProvider.register("view-plan", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.courses = new Object();
	$scope.rooms = new Object();
	$scope.teachers = new Object();
	$scope.plan = new Object();
	
	$scope.getActiveArray("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.get("rooms", rooms => {
		$scope.rooms = rooms;
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});

	$scope.getBySemester("plan", plan => {
		$scope.plan = plan;
	});
});