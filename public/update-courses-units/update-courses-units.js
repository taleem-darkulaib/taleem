application.controllerProvider.register("update-courses-units", ($scope, $timeout) => {
	
	$scope.units = new Object();
	$scope.topicsCompleted = new Object();
	
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
		$scope.topicsCompleted = new Object();
		
		if($scope.level != null
			&& $scope.course != null){
			
			localStorage.setItem("course", $scope.course);
			
			$scope.get("units/" + $scope.course, units => {

				$scope.units = units;
				
				$scope.getBySemester("topics-completed/" + $scope.level + "/" + $scope.course, topicsCompleted => {

					$scope.topicsCompleted = topicsCompleted;
					
					$scope.values($scope.units).forEach(unit => {
						
						unit.topics.forEach(topic => {
							
							topic.selected = topicsCompleted[topic.id] != null;
							topic.time = topicsCompleted[topic.id];
						});
					});
				});
			});
		}
	}
	
	$scope.updateCourse();
	
	$scope.completeTopic = topic => {
		
		if(topic.selected){
			topic.time = moment().format("DD-MM-YYYY HH:mm");
			$scope.topicsCompleted[topic.id] = topic.time;
			$scope.setSilentBySemester("topics-completed/" + $scope.level + "/" + $scope.course + "/" + topic.id, topic.time);
		}else{
			topic.time = null;
			delete $scope.topicsCompleted[topic.id];
			$scope.removeSilentBySemester("topics-completed/" + $scope.level + "/" + $scope.course + "/" + topic.id);
		}
	}
});