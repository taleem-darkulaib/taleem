application.controllerProvider.register("download-marks", ($scope, $timeout, $sce) => {
	
	$scope.teachers = new Object();
	$scope.students = new Array();
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.levelsCourses = new Object();
	$scope.coursesTeachers = new Object();
	$scope.marksDistribution = new Array();
	$scope.attendance = new Object();
	$scope.marks = new Object();
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getArrayBySemester("students", students => {
		$scope.students = students;
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {

		$scope.levels = levels;
		
		$scope.updateLevels();
	});
	
	$scope.getActiveArray("courses", courses => {
			
		$scope.courses = courses;
		
		$scope.updateLevels();	
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {
				
		$scope.levelsCourses = levelsCourses;
		
		$scope.updateLevels();	
	});
	
	$scope.updateLevels = ()=> {
		
		$scope.levels.forEach(level => level.courses = $scope.courses.filter(course => $scope.levelsCourses[level.id] != null
																						&& $scope.levelsCourses[level.id].includes(course.id)));
	}

	$scope.getBySemester("plan", plan => {
		
		Object.entries(plan).forEach(([level, nights]) => {
			
			$scope.coursesTeachers[level] = new Object();
			
			$scope.values(nights).forEach(night => {
				$scope.coursesTeachers[level][night.course] = night.teacher;
			});
		});
	});

	$scope.getArrayBySemester("marks-distribution", marksDistribution => {
		$scope.marksDistribution = marksDistribution;
	});
	
	$scope.getBySemester("night-attend", attendance => {
		$scope.attendance = attendance;
	});
	
	$scope.getBySemester("marks", marks => {		
		$scope.marks = marks;
	});
	
	$scope.downloadMarks = (level, course) => {
		
		let fileName = level.name + " " + course.name;
		
		let rows = new Array();
		let header = new Array();
		
		header.push("#");
		header.push("الرقم الشخصي");
		header.push("اسم الطالب");
		
		$scope.marksDistribution.forEach(distribution => {
			header.push(distribution.title + " (" + distribution.mark + ")");
		});
		
		header.push("المجموع");
			
		rows.push(header);
		
		let attendancePercentage = new Object();
		
		if($scope.attendance[level.id] != null
			&& $scope.attendance[level.id][course.id] != null){
			
			attendancePercentage = $scope.calculateAttendanceMarks($scope.attendance[level.id][course.id]);
		}
		
		if($scope.marks[level.id] == null){
			$scope.marks[level.id] = new Object();
		}
		
		if($scope.marks[level.id][course.id] == null){
			$scope.marks[level.id][course.id] = new Object();
		}
		
		let marks = $scope.marks[level.id][course.id];
		
		$scope.students.filter(student => student.level == level.id).forEach((student, index) => {
			
			student.cpr = student.cpr.toString();
			
			let row = new Array();
			row.push(index + 1);
			row.push(student.cpr);
			row.push(student.name);
			
			if(marks[student.cpr] == null){
				marks[student.cpr] = new Object();
			}
			
			$scope.marksDistribution.forEach(distribution => {
				
				if(distribution.title == "الحضور" && attendancePercentage[student.cpr] != null){
					marks[student.cpr][distribution.id] = Math.ceil(attendancePercentage[student.cpr]/100.0 * distribution.mark);
				}else if(marks[student.cpr][distribution.id] == null){
					marks[student.cpr][distribution.id] = 0;
				}
				
				if(typeof marks[student.cpr][distribution.id] == "string" 
					&& marks[student.cpr][distribution.id].match(/^\d+$/)){
					marks[student.cpr][distribution.id] = Number(marks[student.cpr][distribution.id]);
				}
				
				row.push(marks[student.cpr][distribution.id]);
			});
			
			marks[student.cpr]["المجموع"] = 0;

			$scope.values(marks[student.cpr]).forEach(mark => {
				if(mark != null && !isNaN(mark)){
					marks[student.cpr]["المجموع"] += Number(mark);
				}
			});

			row.push({formula:"=SUM(D" + (index + 2) + ":" + String.fromCharCode(67 + $scope.marksDistribution.length) + (index + 2) + ")"});

			rows.push(row);
		});
		
		$scope.writeExcel(rows, fileName);
	};
});