application.controllerProvider.register("evaluate-students", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.evaluations = new Array();
	$scope.evaluation = new Object();
	$scope.evaluation.id = localStorage.getItem("evaluation") != null ? Number(localStorage.getItem("evaluation")) : null;
	$scope.evaluator = localStorage.getItem("evaluator");
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.cpr = localStorage.getItem("cpr") != null ? localStorage.getItem("cpr") : null;
	$scope.students = new Array();
	$scope.levelStudents = new Array();
	$scope.result = new Object();
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
	
	$scope.updateEvaluator = () => {
		
		localStorage.setItem("evaluator", $scope.evaluator);
	}
	
	$scope.updateEvaluation = () => {
		
		$scope.result = new Object();
		$scope.result.criterias = new Object();
		
		if($scope.evaluation.id != null){
			
			localStorage.setItem("evaluation", $scope.evaluation.id);
			
			$scope.evaluation = $scope.evaluations.find(evaluation => evaluation.id == $scope.evaluation.id);
			
			if($scope.evaluation != null && $scope.evaluation.criterias != null){
				$scope.criterias = $scope.values($scope.evaluation.criterias);
			}else{
				$scope.criterias = new Array();
			}
		}
	}
	
	$scope.updateLevel = () => {
		
		$scope.result = new Object();
		$scope.result.criterias = new Object();
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);
			
			$scope.levelStudents = $scope.students.filter(student => student.level == $scope.level);
		}
	}
	
	$scope.ranges = max => {
		
		let numbers = new Array();
		
		for(let i=0; i<=max; i+=0.5){
			numbers.push(i);
		}
		
		return numbers;
	}
	
	$scope.updateStudent = ()=> {
		
		$scope.result = new Object();
		$scope.result.criterias = new Object();
		
		if($scope.evaluation != null
			&& $scope.evaluation.id != null
			&& $scope.level != null
			&& $scope.cpr != null){
			
			localStorage.setItem("cpr", $scope.cpr);
			
			$scope.getBySemester("students-evaluations/" + $scope.cpr + "/" + $scope.evaluation.id, result => {

				$scope.result = result;
				
				if($scope.result.criterias == null){
					$scope.result.criterias = new Object();
				}
				
				$scope.updateResult();
			});
		}
	}
	
	$scope.updateStudent();
	
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

		$scope.saveResetBySemester("evaluations-students/" + $scope.evaluation.id + "/" + $scope.cpr, $scope.result, "تم حفظ تقييم الطالب بنجاح");
		$scope.saveResetBySemester("students-evaluations/" + $scope.cpr + "/" + $scope.evaluation.id, $scope.result, "تم حفظ تقييم الطالب بنجاح");
	}
});