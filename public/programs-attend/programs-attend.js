application.controllerProvider.register("programs-attend", ($scope, $timeout, $http) => {
	
	$scope.students = new Array();
	$scope.programs = new Array();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.dates = new Array();
	$scope.date = moment().format("DD-MM-YYYY");
	$scope.night = ((moment($scope.date, "DD-MM-YYYY").day() + 1) % 7) + 1;
	$scope.attendance = new Object();
	$scope.counts = new Object();
	
	for(let i=-90; i<=30; i++){
		$scope.dates.push(moment().add(i, "days").format("DD-MM-YYYY"));
	}
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getArray("programs", programs => {
		$scope.programs = programs;
		if($scope.programs.length == 1){
			$scope.program = $scope.programs[0];
		}
		$scope.updateProgram();
	});
	
	$scope.updateProgram = () => {
		
		if($scope.program != null && $scope.program.id != null){
			
			localStorage.setItem("program", $scope.program.id);
			
			$scope.getArray("programs-students/" + $scope.program.id, students => {
				$scope.students = students;
			});
			
			$scope.attendance = new Object();
			
			$scope.get("programs-night-attend/" + $scope.program.id + "/" + $scope.date, attendance => {
				
				$scope.attendance = attendance;
				
				$scope.updateAttendanceCount();
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
		
		$scope.updateProgram();
	}
	
	$scope.updateAttendanceCount = () => {
		
		$scope.counts = {
			total: $scope.students.length,
			records : $scope.values($scope.attendance).filter(attend => attend != null && attend.status != null).length,
			attend : $scope.values($scope.attendance).filter(attend => attend != null && attend.status == "حاضر").length,
			absent : $scope.values($scope.attendance).filter(attend => attend != null && attend.status == "غائب").length,
			late : $scope.values($scope.attendance).filter(attend => attend != null && attend.status == "متأخر").length,
			notify : $scope.values($scope.attendance).filter(attend => attend != null && attend.status == "معتذر").length,
			time : moment().format("DD-MM-YYYY HH:mm:ss")
		};
		
		$scope.counts.percent = Math.ceil($scope.counts.records/$scope.counts.total * 100.0);
	}
	
	$scope.updateStudentAttend = student => {
		
		student.cpr = student.cpr.toString();
		
		$scope.setSilent("programs-night-attend/" + $scope.program.id + "/" + $scope.date + "/" + student.cpr, $scope.attendance[student.cpr]);
		$scope.setSilent("programs-attend/" + $scope.program.id + "/" + student.cpr + "/" + $scope.date, $scope.attendance[student.cpr]);
		
		$scope.updateAttendanceCount();
		
		if($scope.attendance[student.cpr].status == "غائب"
			|| $scope.attendance[student.cpr].status == "متأخر"){
			
			let program = $scope.programs.find(program => program.id == $scope.program.id);
			
			let message = $scope.attendance[student.cpr].status == "غائب" ? $scope.config.absentLetter : $scope.config.lateLetter;
			let contact = student[$scope.config.absentContact];
			
			message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
			message = message.replace(new RegExp('"التاريخ"', "g"), $scope.date);
			message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
			message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), program.name);
			message = message.replace(new RegExp('"المادة"', "g"), program.name);
			
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
	
	$scope.clickStudentAttend = (student, status) => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr] != null && status == $scope.attendance[student.cpr].status){
			
			$scope.attendance[student.cpr] = null;
			
			$scope.updateAttendanceCount();
			
			$scope.removeSilent("programs-night-attend/" + $scope.program.id + "/" + $scope.date + "/" + student.cpr);
			$scope.removeSilent("programs-attend/" + $scope.program.id + "/" + student.cpr + "/" + $scope.date);
		}
	}
	
	$scope.sendWhatsappMessage = student => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr].status == "غائب"
			|| $scope.attendance[student.cpr].status == "متأخر"){
			
			$scope.attendance[student.cpr].notification = true;
			
			let program = $scope.programs.find(program => program.id == $scope.program.id);
			
			let message = $scope.attendance[student.cpr].status == "غائب" ? $scope.config.absentLetter : $scope.config.lateLetter;
			let contact = student[$scope.config.absentContact];
			
			message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
			message = message.replace(new RegExp('"التاريخ"', "g"), $scope.date);
			message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
			message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), $scope.program.name);
			message = message.replace(new RegExp('"المادة"', "g"), $scope.program.name);
			
			if($scope.isStringNotEmpty($scope.config.textMeBot)
				&& $scope.isStringNotEmpty(contact)
				&& $scope.isStringNotEmpty(message)){

				$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
			}
		}
	}
	
	$scope.attendAll = ()=>{
		
		$scope.students.forEach(student => {
			
			student.cpr = student.cpr.toString();

			$scope.attendance[student.cpr] = {status:"حاضر"};
			
			$scope.updateStudentAttend(student);
		});
	}
});