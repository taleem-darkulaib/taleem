application.controllerProvider.register("update-level", ($scope, $timeout) => {

	$scope.levels = new Object();
	$scope.grade = null;
	$scope.level = null;
	
	$scope.getActive("grades", grades => {

		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
		
		$scope.getActiveBySemester("levels", levels => {
			
			$scope.levels = levels;
			
			$scope.getBySemester("distributions", distributions => {
				
				$scope.values($scope.grades).forEach(grade => grade.levels = $scope.values(levels).filter(level => distributions[grade.id] != null
																													&& distributions[grade.id].includes(level.id)));
			});
		});
		
		$scope.getArrayBySemester("students", students => {
			
			$scope.values($scope.grades).forEach(grade => grade.students = students.filter(student => student.grade == grade.id));
		});
	});

	$scope.updateGrade = () => {
		
		$scope.level = null;
		
		$timeout(()=> {
			
			$("#level").trigger("change");
			window.validateElement($("#level"));
		});
	}
	
	$scope.updateLevel = () => {
		
		$scope.grade.students.filter(student => student.selected).forEach(student => {
			
			student.level = $scope.level;
			student.selected = false;
			
			$scope.setResetBySemester("students/" + student.cpr + "/level", $scope.level, "تم تحديث مستوى الطلبة بنجاح");
		});
	}
});