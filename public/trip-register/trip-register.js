application.controllerProvider.register("trip-register", ($scope, $timeout) => {
	
	$scope.levels = new Object();
	$scope.trips = new Array();
	$scope.trip = new Object();
	$scope.trip.id = localStorage.getItem("trip") != null ? Number(localStorage.getItem("trip")) : null;
	$scope.student = new Object();
	$scope.student.cpr = localStorage.getItem("cpr");
	$scope.valid = false;
	$scope.studentUrl = "https://" + window.location.host + "/trip";
	
	$scope.get("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getArrayBySemester("trips", trips => {

		$scope.trips = trips;
		
		$scope.updateTrip();
	});
	
	$scope.updateTrip = () => {
		
		if($scope.trips != null
			&& $scope.trip != null
			&& $scope.trip.id != null){
			
			localStorage.setItem("trip", $scope.trip.id);
			
			$scope.trip = $scope.trips.find(trip => trip.id == $scope.trip.id);
			
			$timeout($scope.uploadPayment);
		}
	}
	
	$("#cpr").focus();
	
	$scope.updateCpr = () => {
		
		if($scope.isValidCpr($scope.student.cpr)){

			localStorage.setItem("cpr", $scope.student.cpr);
			
			$("#cpr").blur();
			
			$scope.getBySemester("students/" + $scope.student.cpr, student =>{
				
				if($scope.isListNotEmpty(student)){
					
					$scope.student = student;
					$scope.student.payment = null;
						
					if($scope.trip.levels.includes($scope.student.level)){
						
						$scope.valid = true;

						$scope.getBySemester("trips-students-payments/" + $scope.student.cpr + "/" + $scope.trip.id, payment => {
							
							if($scope.isListNotEmpty(payment)){
								
								$scope.student.payment = payment.url;
							}
						});
					
					}else{
						
						$scope.danger("الرحلة غير مخصصة لطلبة المستوى " + $scope.levels[student.level].name);
					}
					
				}else{
					
					$scope.danger("الطالب غير مسجل في التعليم");
				}
			});
			
		}else{
			
			$("#cpr").focus();
		}
	}
	
	$scope.updateCpr();
	
	$scope.clearCpr = () => {
		
		$scope.valid = false;
		
		localStorage.removeItem("cpr");
		
		$scope.student = new Object();
		
		$timeout(()=> {
			
			validateElement($("#cpr"));
			
			$("#cpr").focus();
		});
	}
	
	$scope.uploadPayment = ()=> {
		
		$("#payment").change(() => {
		
			$scope.student.payment = $scope.getImage("payment");
			
			console.log($scope.student.payment);
			
			$scope.$digest();
		});
	}
	
	$scope.copyBenefitNumber = () => {
		
		$scope.copyToClipboard($("#benefit").val());
	}
	
	$scope.previewImage = () => {
		
		$("#preview").toast("show");
	}
	
	$scope.saveStudent = () => {
		
		if($scope.isValidForm() && $scope.config.transfer){
			
			let payment = new Object();
			payment.id = moment().valueOf();
			payment.cpr = $scope.student.cpr;
			payment.receiver = "بنفت";
			payment.amount = $scope.student.feesAmount != undefined ? $scope.student.feesAmount : null;
			payment.selected = false;
			payment.url = $scope.student.payment != undefined ? $scope.student.payment : null;
			payment.time = moment().format("DD-MM-YYYY HH:mm:ss");
			
			$scope.setBySemester("trips-payments/" + $scope.trip.id + "/" + $scope.student.cpr, payment, "تم حفظ صورة الدفع بنجاح");
			$scope.setBySemester("trips-students-payments/" + $scope.student.cpr + "/" + $scope.trip.id, payment, "تم حفظ صورة الدفع بنجاح");	
		}
	}
});