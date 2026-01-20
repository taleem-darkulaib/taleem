application.controllerProvider.register("supervisors", ($scope, $timeout) => {
	
	$scope.supervisors = new Object();
	$scope.supervisorList = new Array();
	
	$scope.get("supervisors", supervisors => {
		
		$scope.supervisors = supervisors;
		
		$scope.supervisorList = $scope.activeIndexedArray(supervisors);
		
		if($scope.isListEmpty($scope.supervisorList)){
			
			$scope.addSupervisor(0);
		}
	});
	
	$scope.upSupervisor = index => {
		
		[$scope.supervisorList[index], $scope.supervisorList[index - 1]] = [$scope.supervisorList[index - 1], $scope.supervisorList[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.downSupervisor = index => {
		
		[$scope.supervisorList[index], $scope.supervisorList[index + 1]] = [$scope.supervisorList[index + 1], $scope.supervisorList[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.addSupervisor = index => {
		
		let supervisor = new Object();
		
		supervisor.id = moment().valueOf();
		supervisor.index = index;
		supervisor.active = true;
		supervisor.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.supervisors[supervisor.id] = supervisor;
		
		$scope.supervisorList.splice(index, 0, supervisor);
		
		$timeout(()=> {
			isValidForm();
			$("input[name='supervisors']").eq(index).focus();
		});
	}
	
	$scope.deleteSupervisor = index => {
		
		let supervisor = $scope.supervisorList[index];

		supervisor.index = -1;
		supervisor.active = false;
		supervisor.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.supervisorList.splice(index, 1);
		
		$timeout(isValidForm);
	}

	$scope.saveSupervisors = ()=> {
		
		$scope.supervisorList.forEach((supervisor, index) => supervisor.index = index);
		
		$scope.save("supervisors", $scope.supervisors, "تم حفظ قائمة المشرفين بنجاح");
	}
});