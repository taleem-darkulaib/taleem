application.controllerProvider.register("upload-exam-marks", ($scope, $timeout) => {
	
	$scope.marksDistribution = new Array();
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.levelsCourses = new Object();
	$scope.levelCourses = new Object();
	$scope.plan = new Object();
	$scope.teachers = new Object();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.course = localStorage.getItem("course") != null ? Number(localStorage.getItem("course")) : null;
	$scope.teacher = localStorage.getItem("teacher") != null ? Number(localStorage.getItem("teacher")) : null;
	$scope.marks = new Object();
	
	$scope.getArrayBySemester("marks-distribution", marksDistribution => {
		$scope.marksDistribution = marksDistribution;
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getArray("courses", courses => {

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

	$scope.updateLevel = (reset) => {
		
		if($scope.level != null
			&& $scope.courses != null
			&& $scope.levelsCourses != null){
			
			localStorage.setItem("level", $scope.level);
			
			$scope.levelCourses = $scope.courses.filter(course => $scope.levelsCourses[$scope.level] != null
																	&& $scope.levelsCourses[$scope.level].includes(course.id));
			
			if(reset){
				
				$scope.course = null;
				$scope.teacher = null;
				
				$("#file").val("");
				
				$timeout(() => {
					
					validateElement($("#course"));
					validateElement($("#teacher"));
					validateElement($("#file"));
				});
			}
		}
	}
	
	$scope.updateCourse = function(){
		
		if($scope.level != null
			&& $scope.course != null){
			
			localStorage.setItem("course", $scope.course);
			
			if($scope.isListNotEmpty($scope.plan)){
				
				let nightPlan = $scope.values($scope.plan[$scope.level]).find(night => night.course == $scope.course);

				$scope.teacher = nightPlan != null ? nightPlan.teacher : null;
			
			}else{
				
				$scope.teacher = null;
			}
		}
	}
	
	$("#file").change(() => {
		
		$scope.marks = new Object();
		
		$scope.readExcel("file", rows => {
			
			let records = rows.slice(1);
			
			records.forEach(record => {
				
				let cpr = record[1].toString();
				
				$scope.marks[cpr] = new Object();
				$scope.marks[cpr]["المجموع"] = 0;
				
				$scope.marksDistribution.forEach((distribution, index)=>{

					$scope.marks[cpr][distribution.id] = Number(record[index + 3]);

					$scope.marks[cpr]["المجموع"] += Number($scope.marks[cpr][distribution.id]);
				});
			});
			
			console.log($scope.marks);
		});
	});
	
	$scope.saveExamCourseMarks = () => {
		
		$scope.saveResetBySemester("marks/" + $scope.level + "/" + $scope.course, $scope.marks, "تم حفظ درجات " + $scope.labels.course + " بنجاح");
		
		Object.entries($scope.marks).forEach(([cpr, marks])=> {
			
			$scope.setSilentBySemester("students-marks/" + cpr + "/" + $scope.course, marks);
		});
	}
});