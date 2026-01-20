application.controllerProvider.register("exams-plans", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.courses = new Object();
	$scope.exams = new Object();
	$scope.exam = new Object();
	$scope.exam.id = localStorage.getItem("exam") != null ? Number(localStorage.getItem("exam")) : null;
	
	$scope.getActiveArray("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
		$scope.nights.forEach(night => night.selected = true);
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
		$scope.levels.forEach(level => level.selected = true);
	});
	
	$scope.get("courses", courses => {
		$scope.courses = courses;
	});

	$scope.getBySemester("exams", exams => {
		
		$scope.exams = exams;
		
		$scope.updateExam();
	});
	
	$scope.updateExam = () => {
		
		if($scope.exam.id != null){
			
			localStorage.setItem("exam", $scope.exam.id);
			
			$scope.exam = $scope.exams[$scope.exam.id];
			
			$scope.exam.selectedDates = new Object();

			$scope.exam.dates.forEach(date => $scope.exam.selectedDates[date] = true);
		}
	}
});