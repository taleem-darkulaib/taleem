application.controllerProvider.register("marks-monitor", ($scope, $timeout) => {
	
	$scope.marksDistribution = new Array();
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.students = new Array();
	$scope.levelsCourses = new Object();
	$scope.marks = new Object();
	
	$scope.getArrayBySemester("marks-distribution", marksDistribution => {
		$scope.marksDistribution = marksDistribution;
	});

	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
		$scope.updateLevels();
	});
	
	$scope.getActiveArray("courses", courses => {
		$scope.courses = courses;
		$scope.updateLevels();
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {
		$scope.levelsCourses = levelsCourses;
		$scope.updateLevels();
	});
	
	$scope.getArrayBySemester("students", students => {
		$scope.students = students;
		$scope.updateLevels();
	});
	
	$scope.getBySemester("marks", marks => {
		$scope.marks = marks;
	});
	
	$scope.updateLevels = ()=>{
		
		$scope.levels.forEach(level => {
			
			level.courses = $scope.courses.filter(course => $scope.levelsCourses[level.id] != null
																&& $scope.levelsCourses[level.id].includes(course.id));
			
			level.students = $scope.students.filter(student => student.level == level.id);
		});
	}
});