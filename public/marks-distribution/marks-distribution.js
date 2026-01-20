application.controllerProvider.register("marks-distribution", ($scope, $timeout) => {
	
	$scope.marks = new Array();
	$scope.marksDistribution = new Object();

	for(let i=0; i<=60; i+=5){
		$scope.marks.push(i);
	}
	
	$scope.getBySemester("marks-distribution", marksDistribution => {

		$scope.marksDistribution = marksDistribution;
		
		if($scope.isListEmpty($scope.marksDistribution)){
			$scope.addDistribution();
		}
	});
	
	$scope.addDistribution = () => {
		
		let distribution = new Object();
		
		distribution.id = moment().valueOf();
		distribution.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.marksDistribution[distribution.id] = distribution;
		
		$timeout(()=> $("input[name='distributionsTitles']").last().focus());
	}
	
	$scope.deleteDistribution = distribution => {
		
		delete $scope.marksDistribution[distribution.id];
	}
	
	$scope.saveMarksDistribution = () => {
		
		$scope.values($scope.marksDistribution).forEach(distribution => delete distribution["$$hashKey"]);
		
		$scope.saveBySemester("marks-distribution", $scope.marksDistribution, "تم حفظ توزيع الدرجات بنجاح");
	}
});