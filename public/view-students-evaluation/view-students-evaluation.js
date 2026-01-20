application.controllerProvider.register("view-students-evaluation", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.evaluations = new Array();
	$scope.evaluation = new Object();
	$scope.evaluation.id = localStorage.getItem("evaluation") != null ? Number(localStorage.getItem("evaluation")) : null;
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	
	$scope.students = new Array();
	$scope.student = new Object();
	
	$scope.levelStudents = new Array();
	$scope.criterias = new Array();
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getArrayBySemester("evaluations", evaluations => {

		$scope.evaluations = evaluations;
		
		$scope.updateEvaluation();
	});
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updateLevel();
	});
	
	$scope.updateEvaluation = () => {
		
		if($scope.evaluation.id != null){
			
			localStorage.setItem("evaluation", $scope.evaluation.id);
			
			$scope.evaluation = $scope.evaluations.find(evaluation => evaluation.id == $scope.evaluation.id);
			
			$scope.criterias = $scope.values($scope.evaluation.criterias);
		}
	}
	
	$scope.updateLevel = () => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);
			
			$scope.levelStudents = $scope.students.filter(student => student.level == $scope.level);
			
			$scope.result = new Object();
			
			if($scope.evaluation != null && $scope.evaluation.id != null){
				
				$scope.getBySemester("evaluations-students/" + $scope.evaluation.id, result => {
					$scope.result = result;
				});
			}
		}
	}
	
	$scope.selectStudent = student => {
		$scope.student = student;
	}
	
	$scope.exportToExcel = () =>{
		
		let program = $scope.programs.find(program => program.id == $scope.program.id);
		
		$scope.writeTableToExcel("evaluations", "تقييم طلبة " + program.name);
	}
});