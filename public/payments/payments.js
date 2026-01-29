application.controllerProvider.register("payments", ($scope, $timeout, $http) => {

	$scope.students = new Array();
	$scope.levels = new Array();
	$scope.levelStudents = new Array();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.receiver = localStorage.getItem("receiver");
	
	$scope.paymentCss = {
		undefined:"border-danger",
		false:"border-warning",
		true:"border-success"
	}
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.getBySemester("payments", payments => {
			
			students.forEach(student => student.payment = payments[student.cpr] ?? new Object());
		});
		
		$scope.updateLevel();
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
	});

	$scope.getValue("semesters/" + $rootScope.currentSemester + "/fees", fees => {
		
		if(fees != null && !isNaN(fees)){
			$scope.fees = Number(fees);
		}
	});
	
	$scope.updateLevel = () => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);

			$scope.levelStudents = $scope.students.filter(student => student.level == $scope.level);
		}
	}
	
	$scope.updateReceiver = () => {
		
		localStorage.setItem("receiver", $scope.receiver);
	}
	
	$scope.updateStudentPayment = student => {
		
		student.cpr = student.cpr.toString();
		
		student.payment.id = moment().valueOf();
		student.payment.cpr = student.cpr;
		student.payment.time = moment().format("DD-MM-YYYY HH:mm:ss");
		student.payment.receiver = $scope.receiver;
		student.payment.amount = Number($scope.fees);
		student.payment.level = student.level;
		
		$scope.setSilentBySemester("payments/" + student.cpr, student.payment);
		
		if(student.payment.selected
			&& $scope.isStringNotEmpty($scope.config.paymentLetter)){

			let contact = student[$scope.config.absentContact];
			let message = $scope.config.paymentLetter;
			
			if($scope.isStringNotEmpty(contact)){
			
				message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
				message = message.replace(new RegExp('"التاريخ"', "g"), moment().format("DD-MM-YYYY"));
				message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
				message = message.replace(new RegExp('"المبلغ"', "g"), student.payment.amount);
				
				if(student.level != null){
					
					let level = $scope.levels.find(level => level.id == student.level);
					
					message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), level.name);
				}
				
				let whatsapp = new Object();
				whatsapp.id = moment().valueOf();
				whatsapp.type = "الدفع";
				whatsapp.send = false;
				whatsapp.time = moment().format("DD-MM-YYYY HH:mm:ss");
				whatsapp.mobile = contact;
				whatsapp.content = message;
				
				$scope.setSilent("whatsapp/" + whatsapp.id, whatsapp);
				
				if($scope.isStringNotEmpty($scope.config.textMeBot)){

					$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
				}
			}
		}
	}
});