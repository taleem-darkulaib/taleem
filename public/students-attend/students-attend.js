application.controllerProvider.register("students-attend", ($scope, $timeout, $http) => {
	
	$scope.plan = new Object();
	$scope.students = new Array();
	$scope.levels = new Array();
	$scope.levelsCourses = new Object();
	$scope.levelStudents = new Array();
	$scope.levelCourses = new Array();
	$scope.courses = new Array();
	$scope.dates = new Array();
	$scope.date = moment().format("DD-MM-YYYY");
	$scope.today = moment().format("DD-MM-YYYY");
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.course = localStorage.getItem("course") != null ? Number(localStorage.getItem("course")) : null;
	$scope.teachers = new Object();
	$scope.teacherAttend = new Object();
	$scope.teacher = null;
	$scope.night = ((moment($scope.date, "DD-MM-YYYY").day() + 1) % 7) + 1;
	$scope.attendance = new Object();
	
	for(let i=-90; i<=30; i++){
		$scope.dates.push(moment().add(i, "days").format("DD-MM-YYYY"));
	}
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
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
	
	$scope.getBySemester("plan", plan => {
		
		$scope.plan = plan;
		
		$scope.updatePlan(false);
	});
	
	$scope.previousDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").subtract(1, "days").format("DD-MM-YYYY");
		
		$timeout(()=> $("#date").trigger("change"));
		
		$scope.updateDate();
	}
	
	$scope.nextDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").add(1, "days").format("DD-MM-YYYY");
		
		$timeout(()=> $("#date").trigger("change"));
		
		$scope.updateDate();
	}
	
	$scope.updateDate = () => {
		
		$scope.night = ((moment($scope.date, "DD-MM-YYYY").day() + 1) % 7) + 1;
		
		$scope.updatePlan(true);
	}
	
	$scope.updatePlan = reset =>{
		
		if($scope.level != null
			&& $scope.plan[$scope.level] != null
			&& $scope.plan[$scope.level][$scope.night] != null){
			
			$scope.course = $scope.plan[$scope.level][$scope.night].course;
			$scope.teacher = $scope.plan[$scope.level][$scope.night].teacher;
			
			$scope.updateCourse();
			
		}else if(reset){
			
			$scope.resetCourse();
		
		}else{
			
			$scope.updateCourse();
		}
	}
	
	$scope.updateLevel = reset =>{
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);

			$scope.levelStudents = $scope.students.filter(student => student.level == $scope.level);
			
			$scope.levelCourses = $scope.courses.filter(course => $scope.levelsCourses[$scope.level] != null
																	&& $scope.levelsCourses[$scope.level].includes(course.id));
																	
			if(reset){
				
				$scope.resetCourse();
			}
		}
	}
	
	$scope.resetCourse = () => {
		
		$scope.course = null;
		$scope.teacher = null;
		
		$("#course").val(null);
		
		$timeout(() => {
			
			$("#course").val(null);
			
			$("#course").val(null).trigger("change");
			$("#course").val(null).trigger("change.select2");
			$("#course").val(null).trigger("select2:clear");

			validateElement($("#course"));
			validateElement($("#teacher"));
		});
	}
	
	$scope.updateCourse = () => {
		
		if($scope.course != null){

			localStorage.setItem("course", $scope.course);

			if($scope.level != null
				&& $scope.plan[$scope.level] != null){

				let nightPlan = $scope.values($scope.plan[$scope.level]).find(nightPlan => nightPlan.course == $scope.course);

				$scope.teacher = nightPlan != null ? nightPlan.teacher : null;
				
			}else{

				$scope.teacher = null;
			}

			$scope.getAttendance();
		}
	}
	
	$scope.getAttendance = ()=> {
		
		$scope.attendance = new Object();

		if($scope.level != null
			&& $scope.course != null
			&& $scope.date != null){
			
			$scope.getBySemester("night-attend/" + $scope.level + "/" + $scope.course + "/" + $scope.date, attendance => {
				
				$scope.attendance = attendance;
			});
		}
		
		$scope.teacherAttend = new Object();
		
		if($scope.teacher != null && $scope.date != null){

			$scope.getBySemester("teachers-attend/" + $scope.teacher + "/" + $scope.date, teacherAttend => {

				$scope.teacherAttend = teacherAttend;
			});
		}
	}
	
	$scope.clickTeacherAttend = status => {
		
		if($scope.teacherAttend != null && status == $scope.teacherAttend.status){
			
			$scope.teacherAttend = null;
			
			$scope.removeSilentBySemester("teachers-attend/" + $scope.teacher + "/" + $scope.date);
		}
	}
	
	$scope.updateTeacherAttend = () => {
		
		if($scope.teacherAttend != null){
			
			$scope.setSilentBySemester("attendance-monitor/" + $scope.today + "/" + $scope.level + "/teacher", moment().format("DD-MM-YYYY HH:mm:ss"));
			$scope.setSilentBySemester("teachers-attend/" + $scope.teacher + "/" + $scope.date, $scope.teacherAttend);
		}
	}
	
	$scope.clickStudentAttend = (student, status) => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr] != null && status == $scope.attendance[student.cpr].status){
			
			$scope.attendance[student.cpr] = null;
			
			$scope.removeSilentBySemester("night-attend/" + $scope.level + "/" + $scope.course + "/" + $scope.date + "/" + student.cpr);
			$scope.removeSilentBySemester("students-attend/" + student.cpr + "/" + $scope.course + "/" + $scope.date);
		}
	}
	
	$scope.updateStudentAttend = student => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr] != null){
			
			$scope.setSilentBySemester("attendance-monitor/" + $scope.today + "/" + $scope.level + "/students", moment().format("DD-MM-YYYY HH:mm:ss"));
			$scope.setSilentBySemester("night-attend/" + $scope.level + "/" + $scope.course + "/" + $scope.date + "/" + student.cpr, $scope.attendance[student.cpr]);
			$scope.setSilentBySemester("students-attend/" + student.cpr + "/" + $scope.course + "/" + $scope.date, $scope.attendance[student.cpr]);
			
			if($scope.attendance[student.cpr].status == "غائب"
				|| $scope.attendance[student.cpr].status == "متأخر"){
				
				let course = $scope.courses.find(course => course.id == $scope.course);
				
				let level = $scope.levels.find(level => level.id == $scope.level);
				
				let message = $scope.attendance[student.cpr].status == "غائب" ? $scope.config.absentLetter : $scope.config.lateLetter;
				let contact = student[$scope.config.absentContact];
				
				message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
				message = message.replace(new RegExp('"المادة"', "g"), course.name);
				message = message.replace(new RegExp('"التاريخ"', "g"), $scope.date);
				message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
				message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), level.name);
				
				let whatsapp = new Object();
				whatsapp.id = moment().valueOf();
				whatsapp.type = "الحضور";
				whatsapp.send = false;
				whatsapp.time = moment().format("DD-MM-YYYY HH:mm:ss");
				whatsapp.mobile = contact;
				whatsapp.content = message;
				
				$scope.setSilent("whatsapp/" + whatsapp.id, whatsapp);
			}
		}
	}
	
	$scope.sendWhatsappMessage = student => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr].status == "غائب"
			|| $scope.attendance[student.cpr].status == "متأخر"){
			
			let course = $scope.courses.find(course => course.id == $scope.course);
			
			let level = $scope.levels.find(level => level.id == $scope.level);
			
			$scope.attendance[student.cpr].notification = true;
			
			let message = $scope.attendance[student.cpr].status == "غائب" ? $scope.config.absentLetter : $scope.config.lateLetter;
			let contact = student[$scope.config.absentContact];
			
			message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
			message = message.replace(new RegExp('"المادة"', "g"), course.name);
			message = message.replace(new RegExp('"التاريخ"', "g"), $scope.date);
			message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
			message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), level.name);
			
			if($scope.isStringNotEmpty($scope.config.textMeBot)
				&& $scope.isStringNotEmpty(contact)
				&& $scope.isStringNotEmpty(message)){

				$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
			}
		}
	}
	
	$scope.attendAll = ()=>{
		
		$scope.levelStudents.forEach(student => {
			
			student.cpr = student.cpr.toString();
			
			$scope.attendance[student.cpr] = {status:"حاضر"};
			
			$scope.updateStudentAttend(student);
		});
	}
});