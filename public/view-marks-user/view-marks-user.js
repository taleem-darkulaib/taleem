application.controllerProvider.register("view-marks", ($scope, $timeout) => {
	
	$scope.marksDistribution = new Object();
	$scope.levels = new Object();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.courses = new Object();
	$scope.course = localStorage.getItem("course") != null ? Number(localStorage.getItem("course")) : null;
	$scope.levelsCourses = new Object();
	$scope.plan = new Object();
	$scope.teachers = new Object();
	$scope.teacher = localStorage.getItem("teacher") != null ? Number(localStorage.getItem("teacher")) : null;
	$scope.students = new Object();
	$scope.levelStudents = new Array();
	$scope.marks = new Object();
	
	$scope.getArrayBySemester("marks-distribution", marksDistribution => {
		$scope.marksDistribution = marksDistribution;
	});
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.get("courses", courses => {

		$scope.courses = courses;
		
		$scope.updateLevel();
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {

		$scope.levelsCourses = levelsCourses;
		
		$scope.updateLevel();
	});
	
	$scope.getBySemester("students", students => {

		$scope.students = students;
		
		$scope.updateLevel();
	});

	$scope.updateLevel = () => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);
			
			$scope.levelCourses = $scope.values($scope.courses).filter(course => $scope.levelsCourses[$scope.level] != null
																					&& $scope.levelsCourses[$scope.level].includes(course.id));
			
			$scope.levelStudents = $scope.values($scope.students).filter(student => student.level == $scope.level);
		}
	}
	
	$scope.getBySemester("plan", plan => {

		$scope.plan = plan;
		
		$scope.updateCourse();
	});
	
	$scope.updateCourse = function(){
		
		if($scope.level != null
			&& $scope.course != null){
			
			localStorage.setItem("course", $scope.course);
			
			if($scope.isListNotEmpty($scope.plan)){
				
				let nightPlan = $scope.values($scope.plan[$scope.level]).find(night => night.course == $scope.course);

				if(nightPlan != null){
					$scope.teacher = nightPlan.teacher;
				}else{
					$scope.teacher = null;
				}
			}
			
			$scope.getBySemester("marks/" + $scope.level + "/" + $scope.course, marks => {
				$scope.marks = marks;
			});
		}
	}
	
	$scope.saveStudentCourseMarks = student => {
		
		$scope.saveBySemester("marks/" + $scope.level + "/" + $scope.course + "/" + student.cpr, $scope.marks[student.cpr], "تم حفظ درجات " + $scope.labels.course + " بنجاح");
	}
});