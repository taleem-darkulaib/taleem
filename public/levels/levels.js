application.controllerProvider.register("levels", ($scope, $timeout) => {
	
	$scope.semesters = new Array();
	$scope.sourceSemester = null;
	
	$scope.getArray("semesters", semesters =>{
		$scope.semesters = semesters.filter(semester => semester.id != $scope.currentSemester);
	});
	
	$scope.copyFromSemester = ()=> {
		
		$scope.get("semester-info/" + $scope.sourceSemester + "/levels", levels => {

			$scope.levels = levels;
			
			$scope.levelList = $scope.activeIndexedArray(levels);
			
			if($scope.isListEmpty($scope.levelList)){
				
				$scope.addLevel(0);
			}
		});
	}
	
	$scope.levels = new Object();
	$scope.levelList = new Array();
	
	$scope.getBySemester("levels", levels => {
		
		$scope.levels = levels;
		
		$scope.levelList = $scope.activeIndexedArray(levels);
		
		if($scope.isListEmpty($scope.levelList)){
			
			$scope.addLevel(0);
		}
	});
	
	$scope.upLevel = index => {
		
		[$scope.levelList[index], $scope.levelList[index - 1]] = [$scope.levelList[index - 1], $scope.levelList[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.downLevel = index => {
		
		[$scope.levelList[index], $scope.levelList[index + 1]] = [$scope.levelList[index + 1], $scope.levelList[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.addLevel = index => {
		
		let level = new Object();
		
		level.id = moment().valueOf();
		level.time = moment().format("DD-MM-YYYY HH:mm:ss");
		level.active = true;
		level.index = index;
		
		$scope.levels[level.id] = level;
		
		$scope.levelList.splice(index, 0, level);
		
		$timeout(function(){
			isValidForm();
			$("input[name='levels']").eq(index).focus();
		});
	}
	
	$scope.deleteLevel = index => {
		
		let level = $scope.levelList[index];
		
		level.time = moment().format("DD-MM-YYYY HH:mm:ss");
		level.active = false;
		level.index = -1;
		
		$scope.levelList.splice(index, 1);
		
		$timeout(isValidForm);
	}

	$scope.saveLevels = ()=> {
		
		$scope.levelList.forEach((level, index) => level.index = index);
		
		$scope.saveBySemester("levels", $scope.levels, "تم حفظ قائمة " + $scope.labels.levels + " بنجاح");
	}
});