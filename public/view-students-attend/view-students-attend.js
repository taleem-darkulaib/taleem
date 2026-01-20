application.controllerProvider.register("view-students-attend", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.students = new Array();
	$scope.courses = new Array();
	$scope.levelStudents = new Array();
	$scope.levelsCourses = new Object();
	$scope.levelCourses = new Array();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.attendance = new Object();
	$scope.student = new Object();
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updateLevel(false);
	});
	
	$scope.getActiveArray("courses", courses => {

		$scope.courses = courses;
		
		$scope.updateLevel(false);
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {
			
		$scope.levelsCourses = levelsCourses;
		
		$scope.updateLevel(false);
	});
	
	$scope.updateLevel = calculate => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);

			$scope.levelStudents = $scope.students.filter(student => student.level == $scope.level);
			
			$scope.levelCourses = $scope.courses.filter(course => $scope.levelsCourses[$scope.level] != null && $scope.levelsCourses[$scope.level].includes(course.id));
			
			if(calculate){
				
				$scope.calculateAttendance();
			}
		}
	}
	
	$scope.calculateAttendance = () => {
		
		$scope.attendance = new Object();
		
		if($scope.level != null){
			
			$scope.getBySemester("night-attend/" + $scope.level, attendance =>{
				
				$scope.attendance = $scope.calculateLevelAttendanceMarks(attendance);
			});
		}
	}
	
	$scope.calculateAttendance();
	
	$scope.selectStudent = student => {
		$scope.student = student;
	}
	
	$scope.exportToExcel = () =>{
		
		let rows = new Array();
		
		let header = ["#", "الرقم الشخصي", "اسم الطالب"];
			
		$scope.levelCourses.forEach(course => {
			header.push(course.name);
		});
		
		header.push("المجموع");
		
		rows.push(header);
		
		$scope.levelStudents.forEach((student, index) => {
			
			let records = [index + 1, student.cpr, student.name];
			
			$scope.levelCourses.forEach(course => {
				
				var attend = "";
				
				if($scope.attendance[student.cpr].courses[course.id] != null){
					
					let totalPercentage = $scope.attendance[student.cpr].courses[course.id].statuses['النسبة'];
					let totalLessons = $scope.attendance[student.cpr].courses[course.id].statuses['المجموع'];
					let totalAttends = $scope.attendance[student.cpr].courses[course.id].statuses['المجموع'] - $scope.attendance[student.cpr].courses[course.id].statuses['غائب'];
					
					attend += "(" + totalAttends + "/" + totalLessons + ") %" + totalPercentage;
				}
				
				records.push(attend);
			});
			
			let totalPercentage = $scope.attendance[student.cpr].statuses['النسبة'];
			let totalLessons = $scope.attendance[student.cpr].statuses['المجموع'];
			let totalAttends = $scope.attendance[student.cpr].statuses['المجموع'] - $scope.attendance[student.cpr].statuses['غائب'];

			records.push("(" + totalAttends + "/" + totalLessons + ") %" + totalPercentage);
		
			rows.push(records);
		});
		
		let level = $scope.levels.find(level => level.id == $scope.level);
		
		$scope.writeExcel(rows, "حضور طلبة " + level.name);
	}
});