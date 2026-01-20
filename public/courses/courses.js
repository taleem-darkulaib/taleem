application.controllerProvider.register("courses", ($scope, $timeout) => {
	
	$scope.courses = new Object();
	$scope.courseList = new Array();
	
	$scope.get("courses", courses => {
		
		$scope.courses = courses;
		
		$scope.courseList = $scope.activeIndexedArray(courses);
		
		if($scope.isListEmpty($scope.courseList)){
			
			$scope.addCourse(0);
		}
	});
	
	$scope.upCourse = index => {
		
		[$scope.courseList[index], $scope.courseList[index - 1]] = [$scope.courseList[index - 1], $scope.courseList[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.downCourse = index => {
		
		[$scope.courseList[index], $scope.courseList[index + 1]] = [$scope.courseList[index + 1], $scope.courseList[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.addCourse = index => {
		
		let course = new Object();
		
		course.id = moment().valueOf();
		course.time = moment().format("DD-MM-YYYY HH:mm:ss");
		course.active = true;
		course.index = index;
		
		$scope.courses[course.id] = course;
		
		$scope.courseList.splice(index, 0, course);
		
		$timeout(()=> {
			isValidForm();
			$("input[name='courses']").eq(index).focus();
		});
	}
	
	$scope.deleteCourse = index => {
		
		let course = $scope.courseList[index];
		
		course.time = moment().format("DD-MM-YYYY HH:mm:ss");
		course.active = false;
		course.index = -1;
		
		$scope.courseList.splice(index, 1);
		
		$timeout(isValidForm);
	}

	$scope.saveCourses = ()=> {
		
		$scope.courseList.forEach((course, index) => course.index = index);
		
		$scope.save("courses", $scope.courses, "تم حفظ قائمة " + $scope.labels.courses + " بنجاح");
	}
});