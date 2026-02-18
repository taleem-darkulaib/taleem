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
	$scope.attendanceDates = new Array();
	$scope.dates = new Array();
	$scope.attendanceByDate = new Object();
	$scope.search = new Object();
	$scope.start = 0;
	$scope.absentStudents = new Array();
	
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
				
				$scope.attendanceDates = $scope.getSortedDates(attendance);
				$scope.dates = $scope.getSortedDates(attendance);
				
				if($scope.isListNotEmpty($scope.dates)){
					
					$scope.search.startDate = $scope.dates[0];
					$scope.search.endDate = $scope.dates[$scope.dates.length - 1];
				}
				
				$scope.attendanceByDate = $scope.getAttendanceByDates(attendance);
				
				$scope.start = 0;
				
				$timeout(()=>{
					flatpickr("#startDate", {dateFormat: "d-m-Y", disableMobile: true, onChange:$scope.updatePeriod});
					flatpickr("#endDate", {dateFormat: "d-m-Y", disableMobile: true, onChange:$scope.updatePeriod});
					isValidForm();
				});
				
				$scope.updatePeriod();
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
	
	$scope.previousDate = ()=> {
		
		$scope.start--;
	}
	
	$scope.nextDate = ()=> {
		
		$scope.start++;
	}
	
	$scope.updatePeriod = ()=> {
		
		$timeout(()=> {
			
			console.log("updatePeriod", $scope.search);
		
			$scope.start = 0;
			
			let startDate = moment($scope.search.startDate, "DD-MM-YYYY");
			let endDate = moment($scope.search.endDate, "DD-MM-YYYY");

			$scope.dates = $scope.attendanceDates.filter(date => moment(date, "DD-MM-YYYY").isBetween(startDate, endDate, null, '[]'));
			
			$scope.levelStudents.forEach(student => {
				
				student.absentDates = $scope.dates.filter(date => {
					
					return $scope.attendanceByDate[date][student.cpr] != null
							&& $scope.attendanceByDate[date][student.cpr].status == "غائب";
				});
				
				student.excuseDates = $scope.dates.filter(date => {
					
					return $scope.attendanceByDate[date][student.cpr] != null
							&& $scope.isStringNotEmpty($scope.attendanceByDate[date][student.cpr].comment);
				
				}).map(date => {
					
					let attend = $scope.attendanceByDate[date][student.cpr];
					
					attend.date = date;
					
					return attend;
				});
			});
			
			$scope.absentStudents = $scope.levelStudents.filter(student => student.absentDates.length >= 1);
			$scope.excuseStudents = $scope.levelStudents.filter(student => student.excuseDates.length >= 1);
		});
	}
	
	$scope.exportAbsentToExcel = ()=>{
		
		let rows = new Array();
		
		rows.push(["#", "اسم الطالب", "أرقام التواصل", "أيام الغياب"]);
		
		$scope.absentStudents.forEach((student, index) => {
			
			rows.push([index + 1, student.name, student.mobile + "\n" + student.phone, student.absentDates.join("\n")]);
		});
		
		$scope.writeExcel(rows, "قائمة الغياب");
	}
	
	$scope.exportAllAbsentToExcel = ()=>{
		
		$scope.getBySemester("night-attend", attendance =>{
			
			let sheets = new Array();
			
			let levels = $scope.indexedArray($scope.levels);
			
			levels.forEach(level => {
				
				let attendanceByDate = $scope.getAttendanceByDates(attendance[level.id]);
				
				let levelStudents = $scope.students.filter(student => student.level == level.id);
				
				let startDate = moment($scope.search.startDate, "DD-MM-YYYY");
				let endDate = moment($scope.search.endDate, "DD-MM-YYYY");

				let dates = $scope.attendanceDates.filter(date => moment(date, "DD-MM-YYYY").isBetween(startDate, endDate, null, '[]'));
				
				levelStudents.forEach(student => {
					
					student.absentDates = $scope.dates.filter(date => {
						
						return $scope.attendanceByDate[date][student.cpr] != null
								&& $scope.attendanceByDate[date][student.cpr].status == "غائب";
					});
				});
				
				let absentStudents = levelStudents.filter(student => student.absentDates.length >= 1);
				
				let sheet = new Object();
				
				sheet.name = level.name;
				sheet.rows = new Array();
		
				sheet.rows.push(["#", "اسم الطالب", "أرقام التواصل", "أيام الغياب"]);
				
				absentStudents.forEach((student, index) => {
					
					sheet.rows.push([index + 1, student.name, student.mobile + "\n" + student.phone, student.absentDates.join("\n")]);
				});
				
				sheets.push(sheet);
			});
			
			$scope.writeExcelSheets(sheets, "قائمة الغياب");
		});
	}
});