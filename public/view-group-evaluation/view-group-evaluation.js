application.controllerProvider.register("view-group-evaluation", ($scope, $timeout) => {
	
	$scope.groups = new Array();
	$scope.partitions = new Array();
	$scope.students = new Array();
	$scope.student = new Object();
	$scope.partitionStudents = new Array();
	$scope.evaluations = new Array();
	$scope.evaluation = new Object();
	$scope.evaluation.id = localStorage.getItem("evaluation") != null ? Number(localStorage.getItem("evaluation")) : null;
	$scope.criterias = new Array();
	$scope.group = localStorage.getItem("group") != null ? Number(localStorage.getItem("group")) : null;
	$scope.partition = localStorage.getItem("partition") != null ? Number(localStorage.getItem("partition")) : null;
	$scope.cpr = localStorage.getItem("cpr");
	$scope.result = new Object();

	$scope.getArrayBySemester("groups", groups => {
		$scope.groups = groups;
		$scope.updateGroup(false);
	});

	$scope.getArrayBySemester("evaluations", evaluations => {
		$scope.evaluations = evaluations;
		$scope.updateEvaluation(false);
	});

	$scope.getArrayBySemester("students", students => {
		$scope.students = students;
		$scope.updatePartition();
	});
	
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
				$scope.partitionStudents = new Array();
				$scope.getStudentsEvaluations();
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
				
				$scope.partitionStudents = $scope.students.filter(student => partition.students != null
																				&& partition.students.includes(student.cpr));
			}else{
				
				$scope.partitionStudents = new Array();
			}
		}
	}
	
	$scope.updateEvaluation = fetch => {
		
		if($scope.evaluation.id != null){
			
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
	
	$scope.getStudentsEvaluations = () => {
		
		$scope.result = new Object();
		
		if($scope.evaluation != null
			&& $scope.evaluation.id != null
			&& $scope.group != null){

			$scope.getBySemester("evaluations-groups/" + $scope.evaluation.id + "/" + $scope.group, result => {
				$scope.result = result;
			});
		}
	}
	
	$scope.getStudentsEvaluations();
	
	$scope.selectStudent = student => {
		$scope.student = student;
	}
	
	$scope.exportToExcel = () =>{
		
		let partition = $scope.partitions.find(partition => partition.id == $scope.partition);
		
		$scope.writeTableToExcel("evaluations", "تقييم طلبة " + partition.name);
	}
});