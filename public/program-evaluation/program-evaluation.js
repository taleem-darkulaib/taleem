application.controllerProvider.register("program-evaluation", ($scope, $timeout) => {
	
	$scope.programs = new Array();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.students = new Array();
	$scope.evaluations = new Array();
	$scope.evaluation = new Object();
	$scope.evaluation.id = localStorage.getItem("evaluation") != null ? Number(localStorage.getItem("evaluation")) : null;
	$scope.criterias = new Array();
	$scope.cpr = localStorage.getItem("cpr");
	$scope.evaluator = localStorage.getItem("evaluator");
	$scope.result = new Object();

	$scope.getArray("programs", programs => {
		$scope.programs = programs;
		if($scope.programs.length == 1){
			$scope.program = $scope.programs[0];
		}
		$scope.updateProgram();
	});
	
	$scope.updateProgram = () => {
		
		if($scope.program != null
			&& $scope.program.id != null){
			
			localStorage.setItem("program", $scope.program.id);
			
			$scope.getArray("programs-students/" + $scope.program.id, students => {
				$scope.students = students;
			});
		}
	}
	
	$scope.getArrayBySemester("evaluations", evaluations => {
		$scope.evaluations = evaluations;
		$scope.updateEvaluation();
	});
	
	$scope.updateEvaluator = () => {
		localStorage.setItem("evaluator", $scope.evaluator);
	}
	
	$scope.updateEvaluation = () => {
		
		$scope.result = new Object();
		$scope.result.criterias = new Object();
		
		if($scope.evaluation != null
			&& $scope.evaluation.id != null){
			
			localStorage.setItem("evaluation", $scope.evaluation.id);
			
			$scope.evaluation = $scope.evaluations.find(evaluation => evaluation.id == $scope.evaluation.id);
			
			if($scope.evaluation != null && $scope.evaluation.criterias != null){
				$scope.criterias = $scope.values($scope.evaluation.criterias);
			}else{
				$scope.criterias = new Array();
			}
		}
	}
	
	$scope.updateStudent = ()=> {
		
		$scope.result = new Object();
		$scope.result.criterias = new Object();
		
		if($scope.program != null
			&& $scope.program.id != null
			&& $scope.evaluation != null
			&& $scope.evaluation.id != null
			&& $scope.cpr != null){
			
			localStorage.setItem("cpr", $scope.cpr);
			
			$scope.getBySemester("programs-evaluations/" + $scope.program.id + "/" + $scope.evaluation.id + "/" + $scope.cpr, result => {

				$scope.result = result;
				
				if($scope.result.criterias == null){
					$scope.result.criterias = new Object();
				}
				
				$scope.updateResult();
			});
		}
	}
	
	$scope.updateStudent();
	
	$scope.ranges = max => {
		
		let numbers = new Array();
		
		for(let i=0; i<=max; i+=0.5){
			numbers.push(i);
		}
		
		return numbers;
	}
	
	$scope.updateResult = ()=> {
		
		if($scope.evaluation != null){
			
			if($scope.evaluation.type == "درجات"){
				$scope.result.mark = $scope.criterias.reduce((sum, criteria) => sum + ($scope.result.criterias[criteria.id] != null && $scope.result.criterias[criteria.id].mark != null ? Number($scope.result.criterias[criteria.id].mark) : 0), 0);
			}else if($scope.evaluation.type == "اجتياز"){
				$scope.result.passed = $scope.criterias.filter(criteria => $scope.result.criterias[criteria.id] != null && $scope.result.criterias[criteria.id].mark == "اجتاز").length;
				$scope.result.failed = $scope.criterias.filter(criteria => $scope.result.criterias[criteria.id] != null && $scope.result.criterias[criteria.id].mark == "لم يجتز").length;
			}
		}
	}

	$scope.saveStudentEvaluation = ()=> {

		$scope.result.id = moment().valueOf();
		$scope.result.cpr = $scope.cpr;
		$scope.result.evaluator = $scope.evaluator;
		$scope.result.time = moment().format("DD-MM-YYYY HH:mm:ss");

		$scope.saveResetBySemester("evaluations-programs/" + $scope.evaluation.id + "/" + $scope.program.id + "/" + $scope.cpr, $scope.result, "تم حفظ تقييم الطالب بنجاح");
		$scope.saveResetBySemester("programs-evaluations/" + $scope.program.id + "/" + $scope.evaluation.id + "/" + $scope.cpr, $scope.result, "تم حفظ تقييم الطالب بنجاح");
	}
});