application.controllerProvider.register("courses-units", ($scope, $timeout) => {
	
	$scope.units = new Object();
	$scope.unitList = new Array();
	
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.levelsCourses = new Object();

	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.course = localStorage.getItem("course") != null ? Number(localStorage.getItem("course")) : null;
	$scope.levelCourses = new Array();
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getActiveArray("courses", courses => {

		$scope.courses = courses;
		
		$scope.updateLevel(false);
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {
			
		$scope.levelsCourses = levelsCourses;
		
		$scope.updateLevel(false);
	});

	$scope.updateLevel = reset => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);
			
			$scope.levelCourses = $scope.courses.filter(course => $scope.levelsCourses[$scope.level] != null
																	&& $scope.levelsCourses[$scope.level].includes(course.id));
			
			if(reset){
				
				$scope.course = null;
			}
		}
	}
	
	$scope.updateCourse = ()=>{
		
		$scope.units = new Object();
		$scope.unitList = new Array();
	
		if($scope.level != null
			&& $scope.course != null){
			
			localStorage.setItem("course", $scope.course);
			
			$scope.get("units/" + $scope.course, units => {
		
				$scope.units = units;
				
				$scope.unitList = $scope.activeIndexedArray(units);
				
				if($scope.isListEmpty($scope.unitList)){
					
					$scope.addUnit(0);
				}
			});
		}
	}
	
	$scope.updateCourse();
	
	$scope.upUnit = index => {
		
		[$scope.unitList[index], $scope.unitList[index - 1]] = [$scope.unitList[index - 1], $scope.unitList[index]];
		
		$timeout(isValidForm);
	}

	$scope.downUnit = index => {
		
		[$scope.unitList[index], $scope.unitList[index + 1]] = [$scope.unitList[index + 1], $scope.unitList[index]];
		
		$timeout(isValidForm);
	}

	$scope.addUnit = index => {
		
		let unit = new Object();
		
		unit.id = moment().valueOf();
		unit.index = index;
		unit.topics = new Array();
		unit.active = true;
		unit.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.addTopic(unit, 0);
		
		$scope.units[unit.id] = unit;
		
		$scope.unitList.splice(index, 0, unit);
		
		$timeout(()=> {
			isValidForm();
			$("input[name='units']").eq(index).focus();
		});
	}

	$scope.deleteUnit = index => {
		
		let unit = $scope.unitList[index];
		
		unit.time = moment().format("DD-MM-YYYY HH:mm:ss");
		unit.active = false;
		unit.index = -1;
		
		$scope.unitList.splice(index, 1);
		
		$timeout(isValidForm);
	}

	$scope.upTopic = (unit, index) => {
		
		[unit.topics[index], unit.topics[index - 1]] = [unit.topics[index - 1], unit.topics[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.downTopic = (unit, index) => {
		
		[unit.topics[index], unit.topics[index + 1]] = [unit.topics[index + 1], unit.topics[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.addTopic = (unit, index) => {
		
		let topic = new Object();
		
		topic.id = moment().valueOf();
		topic.time = moment().format("DD-MM-YYYY HH:mm:ss");
		topic.active = true;
		topic.index = index;
		
		unit.topics.splice(index, 0, topic);
		
		let unitIndex = $scope.unitList.indexOf(unit);
		
		$timeout(()=> {
			isValidForm();
			$("#topics-" + unitIndex + "-" + index).focus();
		});
	}
	
	$scope.deleteTopic = (unit, index) => {
		
		unit.topics.splice(index, 1);
		
		$timeout(isValidForm);
	}
	
	$scope.saveUnits = ()=> {
		
		$scope.unitList.forEach((unit, index) => {
			
			unit.index = index;
			unit.topics.forEach((topic, index) => topic.index = index);
		});
		
		$scope.saveReset("units/" + $scope.course, $scope.units, "تم حفظ قائمة وحدات " + $scope.labels.course + " بنجاح");
	}
});