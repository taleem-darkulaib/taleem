application.controllerProvider.register("courses-comments", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.courses = new Object();
	$scope.teachers = new Object();
	$scope.levelsCourses = new Object();
	$scope.levelCourses = new Array();
	$scope.plan = new Object();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.course = localStorage.getItem("course") != null ? Number(localStorage.getItem("course")) : null;
	$scope.comments = new Object();
	$scope.comment = new Object();
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getActive("courses", courses => {
		$scope.courses = courses;
		$scope.updateLevel(false);
	});
	
	$scope.getBySemester("plan", plan => {
		
		$scope.plan = plan;
		
		$scope.updateCourse();
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {
		$scope.levelsCourses = levelsCourses;
		$scope.updateLevel(false);
	});
	
	$scope.updateLevel = (reset) => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);

			$scope.levelCourses = $scope.values($scope.courses).filter(course => $scope.levelsCourses[$scope.level] != null
																	&& $scope.levelsCourses[$scope.level].includes(course.id));
			
			if(reset){
				
				$scope.course = null;

				validateElement($("#course"));
				
				$scope.teacher = null;
				
				$scope.comments = new Object();
			}
		}
	}
	
	$scope.updateCourse = () => {
		
		$scope.teacher = null;
		
		$scope.comments = new Object();
		
		if($scope.course != null){
			
			localStorage.setItem("course", $scope.course);
			
			let nightPlan = $scope.values($scope.plan[$scope.level]).find(night => night.course == $scope.course);
			
			$scope.teacher = nightPlan != null ? nightPlan.teacher : null;
			
			$scope.getBySemester("courses-comments/" + $scope.level + "/" + $scope.course, comments => {

				$scope.comments = comments;
			});
		}
	}
	
	$scope.toAddComment = () =>{
		
		$scope.comment = new Object();
		$scope.comment.id = moment().valueOf();
		
		$timeout(isValidForm);
	}
	
	$scope.toEditComment = comment =>{
		
		$scope.comment = $scope.copy(comment);
		
		$timeout(isValidForm);
	}
	
	$scope.saveCourseComment = () => {

		$scope.comment.level = $scope.level;
		$scope.comment.course = $scope.course;
		$scope.comment.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.saveResetBySemester("courses-comments/" + $scope.level + "/" + $scope.course + "/" + $scope.comment.id, $scope.comment, () => {
			
			$scope.comments[$scope.comment.id] = $scope.comment;
			
			$scope.success("تم حفظ الملاحظة بنجاح");
			
			$("#commentModal").modal("hide");
		});
	}
	
	$scope.selectComment = comment =>{
		$scope.comment = comment;
	}
	
	$scope.deleteComment = () =>{
		
		if($scope.isStringNotEmpty($scope.level)
			&& $scope.isStringNotEmpty($scope.course)){
			
			$scope.removeResetBySemester("courses-comments/" + $scope.level + "/" + $scope.course, ()=> {
				
				$scope.success("تم حذف الملاحظة بنجاح");
				
				delete $scope.comments[$scope.comment.id];
			});
		};
	}
});