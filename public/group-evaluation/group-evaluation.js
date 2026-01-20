application.controllerProvider.register("group-evaluation", ($scope, $timeout) => {

	$scope.teachers = new Object();
	$scope.teacher = null;
	$scope.groups = new Array();
	$scope.partitions = new Array();
	$scope.students = new Array();
	$scope.partitionStudents = new Array();
	$scope.evaluations = new Array();
	$scope.evaluation = new Object();
	$scope.evaluation.id = localStorage.getItem("evaluation") != null ? Number(localStorage.getItem("evaluation")) : null;
	$scope.criterias = new Array();
	$scope.group = localStorage.getItem("group") != null ? Number(localStorage.getItem("group")) : null;
	$scope.partition = localStorage.getItem("partition") != null ? Number(localStorage.getItem("partition")) : null;
	$scope.cpr = localStorage.getItem("cpr");
	$scope.evaluator = localStorage.getItem("evaluator");
	$scope.result = new Object();

	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getArrayBySemester("groups", groups => {
		$scope.groups = groups;
		$scope.updateGroup(false);
	});

	$scope.getArrayBySemester("evaluations", evaluations => {
		$scope.evaluations = evaluations;
		$scope.updateEvaluation();
	});

	$scope.getArrayBySemester("students", students => {
		$scope.students = students;
		$scope.updatePartition();
	});
	
	$scope.updateEvaluator = () => {
		localStorage.setItem("evaluator", $scope.evaluator);
	}
	
	$scope.updateGroup = reset => {
		
		if($scope.group != null){
			
			localStorage.setItem("group", $scope.group);
			
			let group = $scope.groups.find(group => group.id == $scope.group);
			
			if(group != null){
				$scope.partitions = $scope.values(group.partitions);
			}else{
				$scope.partitions = new Array();
			}
			
			if(reset){
				$scope.partition = null;
				$scope.teacher = null;
				$scope.partitionStudents = new Array();
			}else{
				$scope.updatePartition();
			}
		}
	}
	
	$scope.updatePartition = () => {
		
		if($scope.isListNotEmpty($scope.groups)
			&& $scope.group != null
			&& $scope.partition != null){
		
			localStorage.setItem("partition", $scope.partition);
			
			let group = $scope.groups.find(group => group.id == $scope.group);
			
			let partition = $scope.partitions.find(partition => partition.id == $scope.partition);
			
			if(partition != null
				&& $scope.isListNotEmpty($scope.students)){
				
				$scope.teacher = partition.teacher;
			
				$scope.partitionStudents = $scope.students.filter(student => partition.students != null
																				&& partition.students.includes(student.cpr));
			}else{
				
				$scope.teacher = null;
				
				$scope.partitionStudents = new Array();
			}
		}
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
		
		if($scope.evaluation != null
			&& $scope.evaluation.id != null
			&& $scope.cpr != null
			&& $scope.group != null){
			
			localStorage.setItem("cpr", $scope.cpr);
			
			$scope.getBySemester("groups-evaluations/" + $scope.group + "/" + $scope.evaluation.id + "/" + $scope.cpr, result => {

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

		$scope.saveResetBySemester("evaluations-groups/" + $scope.evaluation.id + "/" + $scope.group + "/" + $scope.cpr, $scope.result, "تم حفظ تقييم الطالب بنجاح");
		$scope.saveResetBySemester("groups-evaluations/" + $scope.group + "/" + $scope.evaluation.id + "/" + $scope.cpr, $scope.result, "تم حفظ تقييم الطالب بنجاح");
	}
});