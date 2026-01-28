application.controllerProvider.register("marks", ($scope, $timeout) => {
	
	$scope.marksDistribution = new Array();
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.levelsCourses = new Object();
	$scope.plan = new Object();
	$scope.teachers = new Object();
	$scope.students = new Array();
	$scope.levelStudents = new Array();
	$scope.levelCourses = new Array();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.course = localStorage.getItem("course") != null ? Number(localStorage.getItem("course")) : null;
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
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updateLevel();
	});
	
	$scope.updateLevel = (reset) => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);
			
			if($scope.courses != null && $scope.levelsCourses != null){
				$scope.levelCourses = $scope.courses.filter(course => $scope.levelsCourses[$scope.level] != null && $scope.levelsCourses[$scope.level].includes(course.id));
			}
			
			$scope.levelStudents = $scope.students.filter(student => student.level == $scope.level);
			
			if(reset){
				
				$scope.course = null;
				$scope.teacher = null;
				$scope.marks = new Object();
				
				$timeout(() => {
					
					validateElement($("#course"));
					validateElement($("#teacher"));
				});
			}
		}
	}
	
	$scope.updateCourse = function(){
		
		$scope.marks = new Object();
		
		if($scope.level != null
			&& $scope.course != null){
			
			localStorage.setItem("course", $scope.course);
			
			if($scope.plan[$scope.level] != null){
				
				let nightPlan = $scope.values($scope.plan[$scope.level]).find(night => night.course == $scope.course);

				$scope.teacher = nightPlan != null ? nightPlan.teacher : null;
			
			}else{
				
				$scope.teacher = null;
			}
			
			$scope.getBySemester("night-attend/" + $scope.level + "/" + $scope.course, attendance => {
				
				let attendancePercentage = $scope.calculateAttendanceMarks(attendance);
				
				$scope.getBySemester("marks/" + $scope.level + "/" + $scope.course, marks => {
					
					$scope.marks = marks;
					
					$scope.levelStudents.forEach(student => {
						
						student.cpr = student.cpr.toString();
						
						if($scope.marks[student.cpr] == null){
							$scope.marks[student.cpr] = new Object();
						}
						
						$scope.marksDistribution.forEach(distribution => {
							
							if(distribution.title == "الحضور" && attendancePercentage[student.cpr] != null){
								$scope.marks[student.cpr][distribution.id] = Math.ceil(attendancePercentage[student.cpr]/100.0 * distribution.mark);
							}else if($scope.marks[student.cpr][distribution.id] == null){
								$scope.marks[student.cpr][distribution.id] = 0;
							}
						});
						
						$scope.updateTotal(student);
					});
				});
			});
		}
	}
	
	$scope.updateTotal = student => {
		
		student.cpr = student.cpr.toString();
		
		$scope.marks[student.cpr]["المجموع"] = 0;
		
		$scope.values($scope.marks[student.cpr]).forEach(mark => {
			
			if(mark != null && !isNaN(mark)){
				
				$scope.marks[student.cpr]["المجموع"] += Number(mark);
			}
		});
	}
	
	$scope.saveStudentCourseMarks = student => {
		
		student.cpr = student.cpr.toString();
		
		$scope.setSilentBySemester("students-marks/" + student.cpr + "/" + $scope.course, $scope.marks[student.cpr], ()=> {

			$scope.setSilentBySemester("marks/" + $scope.level + "/" + $scope.course + "/" + student.cpr, $scope.marks[student.cpr], ()=> {

				student.alert = "تم حفظ درجات " + $scope.labels.course + " بنجاح";
				
				$timeout(() => student.alert = null, 3000);
				
				console.log("$scope.config.marksLetter", $scope.config.marksLetter);
				
				if($scope.isStringNotEmpty($scope.config.marksLetter)){
					
					let level = $scope.levels.find(level => level.id == $scope.level);
					let course = $scope.courses.find(course => course.id == $scope.course);
					let contact = student[$scope.config.absentContact];
					let message = $scope.config.marksLetter;
					
					if($scope.isStringNotEmpty(contact)){

						message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
						message = message.replace(new RegExp('"المستوى"', "g"), level.name);
						message = message.replace(new RegExp('"المادة"', "g"), course.name);
						message = message.replace(new RegExp('"التاريخ"', "g"), moment().format("DD-MM-YYYY"));
						message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
						
						let whatsapp = new Object();
						whatsapp.id = moment().valueOf();
						whatsapp.type = "الدرجات";
						whatsapp.send = false;
						whatsapp.time = moment().format("DD-MM-YYYY HH:mm:ss");
						whatsapp.mobile = contact;
						whatsapp.content = message;
						
						$scope.set("whatsapp/" + whatsapp.id, whatsapp);
						
						if($scope.isStringNotEmpty($scope.config.textMeBot)){

							$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
						}
					}
				}
			});
		});
	}
	
	$scope.deleteStudentCourseMarks = student => {
		
		student.cpr = student.cpr.toString();
		
		$scope.removeSilentBySemester("students-marks/" + student.cpr + "/" + $scope.course, ()=> {

			$scope.removeSilentBySemester("marks/" + $scope.level + "/" + $scope.course + "/" + student.cpr, ()=> {
				
				$scope.marks[student.cpr] = new Object();
				
				student.alert = "تم حذف درجات " + $scope.labels.course + " بنجاح";
				
				$timeout(() => student.alert = null, 3000);
			});
		});
	}
});