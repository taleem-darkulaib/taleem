application.controllerProvider.register("group-attendance-monitor", ($scope, $timeout) => {
	
	$scope.dates = new Array();
	$scope.groups = new Array();
	$scope.group = localStorage.getItem("group") != null ? Number(localStorage.getItem("group")) : null;
	$scope.partitions = new Array();
	$scope.attendance = new Object();
	$scope.date = moment().format("DD-MM-YYYY");
	
	for(let i=30; i>=0; i--){
		$scope.dates.push(moment().subtract(i, "days").format("DD-MM-YYYY"));
	}
	
	$scope.getArrayBySemester("groups", groups => {

		$scope.groups = groups;
		
		$scope.updateGroup(false);
	});
	
	$scope.previousDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").subtract(1, "days").format("DD-MM-YYYY");
		
		$timeout(()=> $("#date").trigger("change"));
		
		$scope.updateGroup(true);
	}
	
	$scope.nextDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").add(1, "days").format("DD-MM-YYYY");
		
		$timeout(()=> $("#date").trigger("change"));
		
		$scope.updateGroup(true);
	}
	
	$scope.updateGroup = monitor => {
		
		if($scope.group != null){
			
			localStorage.setItem("group", $scope.group);
			
			let group = $scope.groups.find(group => group.id == $scope.group);
			
			$scope.partitions = $scope.values(group.partitions);
			
			if(monitor){
				
				$scope.updateAttendance();
			}
		}
	}
	
	$scope.updateAttendance = () => {

		if($scope.group != null){

			$scope.attendance = new Object();

			$scope.onUpdateBySemester("group-attendance-monitor/" + $scope.date + "/" + $scope.group, attendance => {

				$scope.attendance = attendance;
			});
		}
	}
	
	$scope.updateAttendance();
});