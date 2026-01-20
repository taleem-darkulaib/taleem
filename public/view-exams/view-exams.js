application.controllerProvider.register("view-exams", ($scope, $timeout) => {
	
	$scope.courses = new Object();
	$scope.levels = new Array();
	$scope.exams = new Object();
	$scope.exam = new Object();
	$scope.exam.id = localStorage.getItem("exam") != null ? Number(localStorage.getItem("exam")) : null;
	
	$scope.getActive("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
		$scope.levels.forEach(level => level.selected = true);
	});
	
	$scope.getBySemester("exams", exams => {
		$scope.exams = exams;
		$scope.updateExam();
	});
	
	$scope.updateExam = () => {
		
		if($scope.exam.id != null){
			
			localStorage.setItem("exam", $scope.exam.id);
			
			$scope.exam = $scope.exams[$scope.exam.id];
		}
	}
});