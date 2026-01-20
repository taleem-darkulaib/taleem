application.controllerProvider.register("levels-courses", ($scope, $timeout) => {
	
	$scope.semesters = new Array();
	$scope.sourceSemester = null;
	
	$scope.getArray("semesters", semesters =>{
		$scope.semesters = semesters.filter(semester => semester.id != $scope.currentSemester);
	});
	
	$scope.copyFromSemester = ()=> {
		
		$scope.get("semester-info/" + $scope.sourceSemester + "/levels-courses", levelsCourses => {

			$scope.levelsCourses = levelsCourses;
			
			$scope.levels.forEach(level => {
				
				if($scope.levelsCourses[level.id] == null){
					
					$scope.levelsCourses[level.id] = new Array();
					
					$scope.addCourse(level, 0);
				}
			});
		});
	}
	
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.levelsCourses = new Object();
	$scope.noLevelsCourses = false;
	
	$scope.getActiveArrayBySemester("levels", levels => {

		$scope.levels = levels;
		
		$scope.getBySemester("levels-courses", levelsCourses => {
			
			$scope.levelsCourses = levelsCourses;
			
			$scope.noLevelsCourses = $scope.isListEmpty($scope.levelsCourses);
			
			$scope.levels.forEach(level => {
				
				if($scope.levelsCourses[level.id] == null){
					
					$scope.levelsCourses[level.id] = new Array();
					
					$scope.addCourse(level, 0);
				}
			});
		});
	});
	
	$scope.getActiveArray("courses", courses => {
		$scope.courses = courses;
	});

	$scope.addCourse = (level, index) => {
		
		let courses = $scope.levelsCourses[level.id];
		
		courses.splice(index, 0, null);
		
		let levelIndex = $scope.levels.indexOf(level);
		
		$timeout(()=>{
			isValidForm();
			$("#level" + levelIndex + "_course" + index).focus();
		});
	}
	
	$scope.upCourse = (level, index) => {
		
		let courses = $scope.levelsCourses[level.id];
		
		[courses[index], courses[index - 1]] = [courses[index - 1], courses[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.downCourse = (level, index) => {
		
		let courses = $scope.levelsCourses[level.id];
		
		[courses[index], courses[index + 1]] = [courses[index + 1], courses[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.deleteCourse = (level, index) => {
		
		let courses = $scope.levelsCourses[level.id];
		
		courses.splice(index, 1);
		
		$timeout(isValidForm);
	}
	
	$scope.saveLevelsCourses = () =>{
		
		$scope.setBySemester("levels-courses", $scope.levelsCourses, "تم حفظ مواد " + $scope.labels.levels + " بنجاح");
	}
});