application.controllerProvider.register("distributions", ($scope, $timeout) => {

	$scope.semesters = new Array();
	$scope.sourceSemester = null;
	
	$scope.getArray("semesters", semesters =>{
		$scope.semesters = semesters.filter(semester => semester.id != $scope.currentSemester);
	});
	
	$scope.copyFromSemester = ()=> {
		
		$scope.get("semester-info/" + $scope.sourceSemester + "/distributions", distributions => {

			$scope.distributions = distributions;
			
			$scope.grades.forEach(grade => {
				
				if($scope.distributions[grade.id] == null){
					
					$scope.distributions[grade.id] = new Array();
					
					$scope.addLevel(grade, 0);
				}
			});
		});
	}
	
	$scope.grades = new Array();
	$scope.levels = new Array();
	$scope.distributions = new Object();
	$scope.noDistributions = false;
	
	$scope.getActiveArray("grades", grades => {
		
		$scope.grades = grades;
		
		$scope.getBySemester("distributions", distributions => {

			$scope.distributions = distributions;
			
			$scope.noDistributions = $scope.isListEmpty(distributions);
			
			$scope.grades.forEach(grade => {
				
				if($scope.distributions[grade.id] == null){
					
					$scope.distributions[grade.id] = new Array();
					
					$scope.addLevel(grade, 0);
				}
			});
		});
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.addLevel = (grade, index) => {
		
		let levels = $scope.distributions[grade.id];
		
		levels.splice(index, 0, null);
		
		let gradeIndex = $scope.grades.indexOf(grade);
		
		$timeout(()=>{
			
			isValidForm();
			$("#grade" + gradeIndex + "_level" + index).focus();
		});
	}
	
	$scope.upLevel = (grade, index) => {
		
		let levels = $scope.distributions[grade.id];
		
		[levels[index], levels[index - 1]] = [levels[index - 1], levels[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.downLevel = (grade, index) => {
		
		let levels = $scope.distributions[grade.id];
		
		[levels[index], levels[index + 1]] = [levels[index + 1], levels[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.deleteLevel = (grade, index) => {
		
		let levels = $scope.distributions[grade.id];
		
		levels.splice(index, 1);
		
		$timeout(isValidForm);
	}
	
	$scope.saveDistributions = () => {
		
		$scope.saveBySemester("distributions", $scope.distributions, "تم حفظ توزيع " + $scope.labels.levels + " بنجاح");
	}
});