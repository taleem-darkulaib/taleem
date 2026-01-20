application.controllerProvider.register("teachers", ($scope, $timeout) => {
	
	$scope.teachers = new Object();
	$scope.teacherList = new Array();
	
	$scope.get("teachers", teachers => {
		
		$scope.teachers = teachers;
		
		$scope.teacherList = $scope.activeIndexedArray(teachers);
		
		if($scope.isListEmpty($scope.teacherList)){
			
			$scope.addTeacher(0);
		}
	});
	
	$scope.upTeacher = index => {
		
		[$scope.teacherList[index], $scope.teacherList[index - 1]] = [$scope.teacherList[index - 1], $scope.teacherList[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.downTeacher = index => {
		
		[$scope.teacherList[index], $scope.teacherList[index + 1]] = [$scope.teacherList[index + 1], $scope.teacherList[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.addTeacher = index => {
		
		let teacher = new Object();
		
		teacher.id = moment().valueOf();
		teacher.index = index;
		teacher.active = true
		teacher.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.teachers[teacher.id] = teacher;
		
		$scope.teacherList.splice(index, 0, teacher);
		
		$timeout(()=> {
			isValidForm();
			$("input[name='teachers']").eq(index).focus();
		});
	}
	
	$scope.deleteTeacher = index => {
		
		let teacher = $scope.teacherList[index];
		
		teacher.time = moment().format("DD-MM-YYYY HH:mm:ss");
		teacher.active = false;
		teacher.index = -1;
		
		$scope.teacherList.splice(index, 1);
		
		$timeout(isValidForm);
	}

	$scope.saveTeachers = ()=> {
		
		$scope.teacherList.forEach((teacher, index) => teacher.index = index);
		
		$scope.save("teachers", $scope.teachers, "تم حفظ قائمة المعلمين بنجاح");
	}
});