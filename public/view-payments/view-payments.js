application.controllerProvider.register("view-payments", ($scope, $timeout, $http) => {

	$scope.levels = new Object();
	$scope.students = new Object();
	$scope.payments = new Object();
	$scope.payment = new Object();
	$scope.search = new Object();
	$scope.matchedPayments = new Array();
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getBySemester("students", students => {
		
		$scope.students = students;
		
		$scope.updateStudents();
	});
	
	$scope.getBySemester("payments", payments => {
			
		$scope.payments = payments;
		
		$scope.updateStudents();
	});
	
	$scope.updateStudents = ()=>{
		
		$scope.values($scope.students).forEach(student => {

			student.cpr = student.cpr.toString();
			
			if($scope.payments[student.cpr] == null){
				student.payment = "لم يدفع";
			}else if(!$scope.payments[student.cpr].selected){
				student.payment = "قيد المراجعة";
			}else if($scope.payments[student.cpr].selected){
				student.payment = "تمت المراجعة";
			}
		});
		
		$scope.searchStudents();
	}
	
	$scope.searchStudents = ()=>{
		
		$scope.matchedPayments = $scope.values($scope.payments).filter(payment => {
			
			let student = $scope.students[payment.cpr];
			
			if(student != null){
				
				return ($scope.isStringEmpty($scope.search.cpr) || student.cpr.toString().trim().includes($scope.search.cpr.trim()))
						&& ($scope.isStringEmpty($scope.search.name) || student.name.trim().includes($scope.search.name.trim()))
						&& ($scope.isStringEmpty($scope.search.mobile) || student.mobile.toString().trim().includes($scope.search.mobile.trim()))
						&& ($scope.isStringEmpty($scope.search.grade) || student.grade == $scope.search.grade)
						&& ($scope.isStringEmpty($scope.search.level) || student.level == $scope.search.level)
						&& ($scope.isStringEmpty($scope.search.payment) || student.payment == $scope.search.payment);
			}else{
				
				return true;
			}
		});	
	}
	
	$scope.selectPayment = payment => {
		$scope.payment = payment;
	}
	
	$scope.confirmPayment = () =>{
		
		$scope.payment.selected = true;
		$scope.payment.confirmTime = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.setSilentBySemester("payments/" + $scope.payment.cpr, $scope.payment);
		
		if($scope.isStringNotEmpty($scope.config.paymentLetter)){
			
			let student = $scope.students[$scope.payment.cpr];
			
			let contact = student[$scope.config.absentContact];
			let message = $scope.config.paymentLetter;
			
			message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
			message = message.replace(new RegExp('"التاريخ"', "g"), moment().format("DD-MM-YYYY"));
			message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
			message = message.replace(new RegExp('"المبلغ"', "g"), $scope.payment.amount);
			
			if(student.level != null){
				
				message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), $scope.levels[student.level].name);
			}
			
			let whatsapp = new Object();
			whatsapp.id = moment().valueOf();
			whatsapp.type = "الدفع";
			whatsapp.send = false;
			whatsapp.time = moment().format("DD-MM-YYYY HH:mm:ss");
			whatsapp.mobile = contact;
			whatsapp.content = message;
			
			$scope.setSilent("whatsapp/" + whatsapp.id, whatsapp);
			
			if($scope.isStringNotEmpty($scope.config.textMeBot)
				&& $scope.isStringNotEmpty(contact)){

				$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
			}
		}
	}
	
	$scope.exportToExcel = () =>{
		
		$scope.writeTableToExcel("payments", "دفع الرسوم");
	}
});