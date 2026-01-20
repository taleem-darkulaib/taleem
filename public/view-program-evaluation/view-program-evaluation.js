application.controllerProvider.register("view-program-evaluation", ($scope, $timeout) => {
	
	$scope.programs = new Array();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.students = new Array();
	$scope.student = new Object();
	$scope.evaluations = new Array();
	$scope.evaluation = new Object();
	$scope.evaluation.id = localStorage.getItem("evaluation") != null ? Number(localStorage.getItem("evaluation")) : null;
	$scope.criterias = new Array();
	$scope.result = new Object();
	
	$scope.getStudentsEvaluations = () => {
		
		$scope.result = new Object();
		
		if($scope.evaluation != null
			&& $scope.evaluation.id != null
			&& $scope.program != null
			&& $scope.program.id != null){

			$scope.getBySemester("evaluations-programs/" + $scope.evaluation.id + "/" + $scope.program.id, result => {
				$scope.result = result;
			});
		}
	}
	
	$scope.getStudentsEvaluations();
	
	$scope.getArrayBySemester("evaluations", evaluations => {
		$scope.evaluations = evaluations;
		$scope.updateEvaluation(false);
	});

	$scope.getArray("programs", programs => {
		$scope.programs = programs;
		if($scope.programs.length == 1){
			$scope.program = $scope.programs[0];
		}
		$scope.updateProgram(false);
	});
	
	$scope.updateProgram = fetch => {
		
		if($scope.program != null
			&& $scope.program.id != null){
			
			localStorage.setItem("program", $scope.program.id);
			
			$scope.getArray("programs-students/" + $scope.program.id, students => {
				$scope.students = students;
			});
			
			if(fetch){
				$scope.getStudentsEvaluations();
			}
		}
	}
	
	$scope.updateProgram(false);
	
	$scope.updateEvaluation = fetch => {
		
		if($scope.evaluation != null
			&& $scope.evaluation.id != null){
			
			localStorage.setItem("evaluation", $scope.evaluation.id);
			
			$scope.evaluation = $scope.evaluations.find(evaluation => evaluation.id == $scope.evaluation.id);
			
			if($scope.evaluation != null && $scope.evaluation.criterias != null){
				$scope.criterias = $scope.values($scope.evaluation.criterias);
			}else{
				$scope.criterias = new Array();
			}
			
			if(fetch){
				$scope.getStudentsEvaluations();
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