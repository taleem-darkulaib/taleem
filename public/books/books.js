application.controllerProvider.register("books", ($scope, $timeout) => {
	
	$scope.courses = new Array();
	$scope.levels = new Array();
	$scope.levelsCourses = new Object();
	$scope.students = new Array();
	$scope.levelStudents = new Array();
	$scope.levelCourses = new Array();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.books = new Object();

	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getActiveArray("courses", courses => {

		$scope.courses = courses;
		
		$scope.updateLevel();
	});
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updateLevel();
	});

	$scope.getBySemester("levels-courses", levelsCourses => {
		
		$scope.levelsCourses = levelsCourses;
		
		$scope.updateLevel();
	});

	$scope.updateLevel = () => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);

			$scope.levelStudents = $scope.students.filter(student => student.level == $scope.level);
			
			$scope.levelCourses = $scope.courses.filter(course => $scope.levelsCourses[$scope.level] != null
																	&& $scope.levelsCourses[$scope.level].includes(course.id));
		}
	}
	
	$scope.getBySemester("books", books => {
		$scope.books = books;
	});
	
	$scope.updateStudentBook = (student, course) => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.books[student.cpr][course.id].selected){
			
			$scope.books[student.cpr][course.id].id = moment().valueOf();
			$scope.books[student.cpr][course.id].time = moment().format("DD-MM-YYYY HH:mm:ss");
			$scope.books[student.cpr][course.id].cpr = student.cpr;
			$scope.books[student.cpr][course.id].course = course.id;
			$scope.books[student.cpr][course.id].level = student.level;
			
			$scope.setSilentBySemester("books/" + student.cpr + "/" + course.id, $scope.books[student.cpr][course.id]);
			
		}else{
			
			$scope.books[student.cpr][course.id] = null;
			
			$scope.removeSilentBySemester("books/" + student.cpr + "/" + course.id);
		}
	}
});