application.controllerProvider.register("evaluations", ($scope, $timeout) => {
	
	$scope.marks = new Array();
	$scope.evaluations = new Object();
	$scope.evaluation = new Object();

	for(let i=0; i<=10; i+=0.5){
		$scope.marks.push(i);
	}
	
	$scope.getBySemester("evaluations", evaluations => {
		$scope.evaluations = evaluations;
	});
	
	$scope.toAddEvaluation = () => {

		$scope.info("يرجى ادخال معلومات التقييم");
		
		$scope.evaluation = new Object();
		$scope.evaluation.id = moment().valueOf();
		$scope.evaluation.type = "درجات";
		$scope.evaluation.criterias = new Object();
		$scope.evaluation.comment = false;
		
		$scope.addCriteria();
		
		$timeout(isValidForm);
	}
	
	$scope.toEditEvaluation = evaluation => {
		
		$scope.info("يمكنك تحديث معلومات التقييم");
		
		$scope.evaluation = $scope.copy(evaluation);
		
		if($scope.evaluation.comment == null){
			$scope.evaluation.comment = false;
		}
		
		if($scope.evaluation.criterias == null){
			$scope.evaluation.criterias = new Object();
			$scope.addCriteria();
		}
		
		$timeout(isValidForm);
	}
	
	$scope.selectEvaluation = evaluation => {
		$scope.evaluation = evaluation;
	}
	
	$("#file").change(() => {
		
		$scope.readExcel("file", rows => {
			
			let criteriaRows = rows.slice(1);
			
			criteriaRows.forEach((criteriaRow, index) => {
				
				let criteria = new Object();

				criteria.id = index + 1;
				criteria.name = criteriaRow[1];
				criteria.mark = Number(criteriaRow[2]);
				criteria.time = moment().format("DD-MM-YYYY HH:mm:ss");
				
				$scope.evaluation.criterias[criteria.id] = criteria;
			});
		});
	});
	
	$scope.addCriteria = () => {
		
		let criteria = new Object();
		
		criteria.id = moment().valueOf();
		criteria.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.evaluation.criterias[criteria.id] = criteria;
		
		$timeout(()=> $("input[name='criteriasNames']").last().focus());
	}
	
	$scope.deleteCriteria = criteria => {
		
		delete $scope.evaluation.criterias[criteria.id];
	}
	
	$scope.saveEvaluation = () => {
		
		$scope.values($scope.evaluation.criterias).forEach(criteria => delete criteria["$$hashKey"]);
		
		$scope.evaluation.count = $scope.length($scope.evaluation.criterias);
		
		if($scope.evaluation.type == "درجات"){
			$scope.evaluation.total = $scope.values($scope.evaluation.criterias).reduce((sum, criteria) => sum + Number(criteria.mark), 0);
		}
		
		$scope.evaluation.time = moment().format("DD-MM-YYYY HH:mm:ss");
			
		$scope.saveResetBySemester("evaluations/" + $scope.evaluation.id, $scope.evaluation, ()=> {
			
			$scope.success("تم حفظ التقييم بنجاح");
			
			$scope.evaluations[$scope.evaluation.id] = $scope.evaluation;
			
			$("#evaluationModal").modal("hide");
		});
	}
	
	$scope.deleteEvaluation = () => {
		
		if($scope.isStringNotEmpty($scope.evaluation.id)){
			
			$scope.removeResetBySemester("evaluations/" + $scope.evaluation.id, ()=> {
				
				delete $scope.evaluations[$scope.evaluation.id];
				
				$scope.success("تم حذف التقييم بنجاح");
			});
		}
	}
});