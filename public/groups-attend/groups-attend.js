application.controllerProvider.register("groups-attend", ($scope, $timeout, $http) => {
	
	$scope.groups = new Array();
	$scope.partitions = new Array();
	$scope.students = new Array();
	$scope.partitionStudents = new Array();
	$scope.courses = new Object();
	$scope.dates = new Array();
	$scope.date = moment().format("DD-MM-YYYY");
	$scope.teachers = new Object();
	$scope.teacherAttend = new Object();
	$scope.teacher = null;
	$scope.course = localStorage.getItem("course") != null ? Number(localStorage.getItem("course")) : null;
	$scope.attendance = new Object();
	$scope.group = localStorage.getItem("group") != null ? Number(localStorage.getItem("group")) : null;
	$scope.partition = localStorage.getItem("partition") != null ? Number(localStorage.getItem("partition")) : null;
	$scope.night = ((moment($scope.date, "DD-MM-YYYY").day() + 1) % 7) + 1;
	
	for(let i=-90; i<=30; i++){
		$scope.dates.push(moment().add(i, "days").format("DD-MM-YYYY"));
	}
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.get("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getArrayBySemester("groups", groups => {

		$scope.groups = groups;
		
		$scope.updateGroup(false);
	});

	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updatePartition(false);
	});
	
	$scope.updateGroup = reset => {
		
		if($scope.group != null){
			
			localStorage.setItem("group", $scope.group);
			
			let group = $scope.groups.find(group => group.id == $scope.group);
			
			if(group != null){
				
				$scope.course = group.course;
			
				$scope.partitions = $scope.values(group.partitions);
			}
			
			if(reset){
				$scope.partition = null;
				$scope.teacher = null;
				$scope.partitionStudents = new Array();
				$scope.teacherAttend = new Object();
				$scope.attendance = new Object();
			}else{
				$scope.updatePartition(true);
			}
		}
	}
	
	$scope.updatePartition = fetch => {
		
		if($scope.group != null
			&& $scope.partition != null){
		
			localStorage.setItem("partition", $scope.partition);
			
			let group = $scope.groups.find(group => group.id == $scope.group);
			
			let partition = $scope.partitions.find(partition => partition.id == $scope.partition);
			
			if(partition != null){
				
				$scope.teacher = partition.teacher;
			
				$scope.partitionStudents = $scope.students.filter(student => partition.students != null
																			&& partition.students.includes(student.cpr));
			}else{
				
				$scope.teacher = null;
				
				$scope.partitionStudents = new Array();
			}
			
			if(fetch){
				$scope.getAttendance();
			}
		}
	}
	
	$scope.getAttendance = () => {
		
		$scope.teacherAttend = new Object();

		if($scope.teacher != null
			&& $scope.date != null){
				
			$scope.getBySemester("teachers-attend/" + $scope.teacher + "/" + $scope.date, teacherAttend => {
				
				$scope.teacherAttend = teacherAttend;
			});
		}
		
		$scope.attendance = new Object();
		
		if($scope.group != null
			&& $scope.partition != null
			&& $scope.date != null){
			
			$scope.getBySemester("groups-attend/" + $scope.group + "/" + $scope.partition + "/" + $scope.date, attendance => {
				
				$scope.attendance = attendance;
			});
		}
	}
	
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
		
		$scope.getAttendance();
	}
	
	$scope.clickTeacherAttend = status => {
		
		if($scope.teacherAttend != null && status == $scope.teacherAttend.status){
			
			$scope.teacherAttend = null;
			
			$scope.removeSilentBySemester("teachers-attend/" + $scope.teacher + "/" + $scope.date);
		}
	}
	
	$scope.updateTeacherAttend = () => {
		
		if($scope.teacherAttend != null){
			
			$scope.setSilentBySemester("group-attendance-monitor/" + $scope.date + "/" + $scope.group + "/" + $scope.partition + "/teacher", moment().format("DD-MM-YYYY HH:mm:ss"));
			$scope.setSilentBySemester("teachers-attend/" + $scope.teacher + "/" + $scope.date, $scope.teacherAttend);
		}
	}
	
	$scope.clickStudentAttend = (student, status) => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr] != null && status == $scope.attendance[student.cpr].status){
			
			$scope.attendance[student.cpr] = null;
			
			$scope.removeSilentBySemester("groups-attend/" + $scope.group + "/" + $scope.partition + "/" + $scope.date + "/" + student.cpr);
			$scope.removeSilentBySemester("night-attend/" + student.level + "/" + $scope.course + "/" + $scope.date + "/" + student.cpr);
			$scope.removeSilentBySemester("students-attend/" + student.cpr + "/" + $scope.course + "/" + $scope.date);
		}
	}
	
	$scope.updateStudentAttend = student => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr] != null){
			
			$scope.setSilentBySemester("group-attendance-monitor/" + $scope.date + "/" + $scope.group + "/" + $scope.partition + "/students", moment().format("DD-MM-YYYY HH:mm:ss"));
			$scope.setSilentBySemester("groups-attend/" + $scope.group + "/" + $scope.partition + "/" + $scope.date + "/" + student.cpr, $scope.attendance[student.cpr]);
			$scope.setSilentBySemester("night-attend/" + student.level + "/" + $scope.course + "/" + $scope.date + "/" + student.cpr, $scope.attendance[student.cpr]);
			$scope.setSilentBySemester("students-attend/" + student.cpr + "/" + $scope.course + "/" + $scope.date, $scope.attendance[student.cpr]);
		}
	}
	
	$scope.sendWhatsappMessage = student => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr].status == "غائب"
			|| $scope.attendance[student.cpr].status == "متأخر"){
			
			$scope.attendance[student.cpr].notification = true;
			
			let group = $scope.groups.find(group => group.id == $scope.group);
			
			let message = $scope.attendance[student.cpr].status == "غائب" ? $scope.config.absentLetter : $scope.config.lateLetter;
			let contact = student[$scope.config.absentContact];
			message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
			message = message.replace(new RegExp('"المادة"', "g"), $scope.courses[group.course]);
			message = message.replace(new RegExp('"التاريخ"', "g"), $scope.date);
			message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
			message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), group.name);
			
			let whatsapp = new Object();
			whatsapp.id = moment().valueOf();
			whatsapp.type = "الحضور";
			whatsapp.send = false;
			whatsapp.time = moment().format("DD-MM-YYYY HH:mm:ss");
			whatsapp.mobile = contact;
			whatsapp.content = message;
			
			$scope.setSilent("whatsapp/" + whatsapp.id, whatsapp);
			
			if($scope.isStringNotEmpty($scope.config.textMeBot)
				&& $scope.isStringNotEmpty(contact)
				&& $scope.isStringNotEmpty(message)){

				$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
			}
		}
	}
	
	$scope.attendAll = ()=>{
		
		$scope.partitionStudents.forEach(student => {
			
			student.cpr = student.cpr.toString();
			
			$scope.attendance[student.cpr] = {status:"حاضر"};
			
			$scope.updateStudentAttend(student);
		});
	}
});