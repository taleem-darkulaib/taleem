application.controllerProvider.register("attendance-monitor", ($scope, $timeout) => {
	
	$scope.dates = new Array();
	$scope.levels = new Array();
	$scope.date = moment().format("DD-MM-YYYY");
	$scope.attendance = new Object();

	for(let i=30; i>=0; i--){
		$scope.dates.push(moment().subtract(i, "days").format("DD-MM-YYYY"));
	}
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.previousDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").subtract(1, "days").format("DD-MM-YYYY");
		
		$scope.updateDate();
		
		$timeout(()=> $("#date").trigger("change"));
	}
	
	$scope.nextDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").add(1, "days").format("DD-MM-YYYY");
		
		$scope.updateDate();
		
		$timeout(()=> $("#date").trigger("change"));
	}
	
	$scope.updateDate = () => {
		
		$scope.attendance = new Object();
		
		$scope.onUpdateBySemester("attendance-monitor/" + $scope.date, attendance => {
			$scope.attendance = attendance;
		});
	}
	
	$scope.updateDate();
});