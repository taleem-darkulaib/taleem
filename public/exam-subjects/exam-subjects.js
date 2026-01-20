application.controllerProvider.register("exam-subjects", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.levelsCourses = new Object();
	$scope.teachers = new Object();
	$scope.plan = new Object();
	$scope.exams = new Array();
	$scope.exam = localStorage.getItem("exam") != null ? Number(localStorage.getItem("exam")) : null;
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.course = localStorage.getItem("course") != null ? Number(localStorage.getItem("course")) : null;
	$scope.teacher = localStorage.getItem("teacher") != null ? Number(localStorage.getItem("teacher")) : null;
	$scope.units = new Object();
	$scope.subjects = new Array();

	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getActiveArray("courses", courses => {

		$scope.courses = courses;
		
		$scope.updateLevel(false);
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {

		$scope.levelsCourses = levelsCourses;
		
		$scope.updateLevel(false);
	});
	
	$scope.getBySemester("plan", plan => {

		$scope.plan = plan;
		
		$scope.updateCourse();
	});
	
	$scope.getArrayBySemester("exams", exams => {
		$scope.exams = exams;
	});

	$scope.updateLevel = (reset) => {
		
		if($scope.level != null
			&& $scope.courses != null
			&& $scope.levelsCourses != null){
			
			localStorage.setItem("level", $scope.level);
			
			$scope.levelCourses = $scope.courses.filter(course => $scope.levelsCourses[$scope.level] != null && $scope.levelsCourses[$scope.level].includes(course.id));
			
			if(reset){
				
				$scope.course = null;
				$scope.teacher = null;
				$scope.subjects = new Array();
				
				$timeout(() => {
					
					validateElement($("#course"));
					validateElement($("#teacher"));
				});
			}
		}
	}
	
	$scope.updateCourse = () => {
		
		$scope.teacher = null;
		$scope.units = new Object();
		$scope.subjects = new Array();
		
		if($scope.exam != null
			&& $scope.level != null
			&& $scope.course != null){
			
			localStorage.setItem("course", $scope.course);
			
			if($scope.isListNotEmpty($scope.plan)){
				
				let nightPlan = $scope.values($scope.plan[$scope.level]).find(night => night.course == $scope.course);

				$scope.teacher = nightPlan != null ? nightPlan.teacher : null;
			}
			
			$scope.getArrayBySemester("exams-subjects/" + $scope.exam + "/" + $scope.level + "/" + $scope.course, subjects => {
			
				$scope.subjects = subjects;
			});
			
			$scope.get("units/" + $scope.course, units => {

				$scope.units = units;
			});
		}
	}
	
	$scope.updateExam = () => {
		
		if($scope.exam != null){
			
			localStorage.setItem("exam", $scope.exam);
		}
	}
	
	$scope.selectUnit = unit =>{
		
		$timeout(()=>{
			
			if($scope.subjects.includes(unit.id)){
				unit.topics.forEach(topic => $scope.subjects.push(topic.id));
			}else{
				unit.topics.forEach(topic => $scope.subjects.splice($scope.subjects.indexOf(topic.id), 1));
			}
		});
	}
	
	$scope.saveExamSubjects = () => {
		
		$scope.subjects.forEach(subject => delete subject["$$hashKey"]);
		
		$scope.saveResetBySemester("exams-subjects/" + $scope.exam + "/" + $scope.level + "/" + $scope.course, $scope.subjects, "تم حفظ الدروس المطلوبة بنجاح");
	}
});