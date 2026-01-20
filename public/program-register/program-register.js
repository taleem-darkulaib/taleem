application.controllerProvider.register("program-register", ($scope, $timeout) => {
	
	$scope.rooms = new Object();
	$scope.programGrades = new Array();
	$scope.programs = new Array();
	$scope.program = null;
	$scope.student = new Object();
	$scope.valid = false;
	$scope.studentUrl = "https://" + window.location.host + "/program";
	
	$scope.get("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
		$scope.updateProgram();
	});
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});

	$scope.get("rooms", rooms => {
		$scope.rooms = rooms;
	});
	
	$scope.getArray("programs", programs => {
		$scope.programs = programs.filter(program => program.registration);
		if($scope.programs.length == 1){
			$scope.program = $scope.programs[0];
			$scope.updateProgram();
			$scope.updateCpr();
		}
	});
	
	$("#cpr").focus();
	
	$scope.updateCpr = () => {
		
		if($scope.isValidCpr($scope.student.cpr)){
			
			$scope.valid = true;
			
			localStorage.setItem("cpr", $scope.student.cpr);
			
			$("#cpr").blur();
			
			$scope.get("programs-students/" + $scope.program.id + "/" + $scope.student.cpr, student => {
				
				if($scope.isListNotEmpty(student)){
					$scope.student = student;
				}else{
					
					$scope.getBySemester("students/" + $scope.student.cpr, student =>{
						
						if($scope.isListNotEmpty(student)){
							$scope.student = student;
							$scope.student.payment = null;
						}
					});
				}
			});
			
		}else{
			
			$("#cpr").focus();
		}
	}
	
	$scope.clearCpr = () => {
		
		$scope.valid = false;
		
		localStorage.removeItem("cpr");
		
		$scope.student = new Object();
		
		$timeout(()=> {
			
			validateElement($("#cpr"));
			
			$("#cpr").focus();
		});
	}
	
	$scope.updateProgram = () => {
		
		if($scope.program != null && $scope.program.id != null){
			
			$scope.programGrades = $scope.values($scope.grades).filter(grade => $scope.program.grades.includes(grade.id));
			
			$timeout($scope.uploadPayment);
		}
	}
	
	$scope.updateStudent = () => {
		
		if($scope.valid && $scope.isValidCpr($scope.student.cpr)){
			
			$scope.student.id = moment().valueOf();
			$scope.student.time = moment().format("DD-MM-YYYY HH:mm:ss");
			
			$scope.setSilent("programs-students/" + $scope.program.id + "/" + $scope.student.cpr, $scope.student);
		}
	}
	
	$(":input").not("#cpr,#program").change(() => {
		
		$scope.updateStudent();
	});
	
	$scope.uploadPayment = ()=> {
		
		$("#payment").change(() => {
		
			$scope.student.payment = $scope.getImage("payment");
			
			console.log($scope.student.payment);
			
			$scope.$digest();
			
			$scope.upload($scope.program.id + "-" + $scope.student.cpr + ".jpg", "payment", url => {
				
				$scope.student.payment = url;
				
				$scope.updateStudent();
			});
		});
	}
	
	$scope.copyBenefitNumber = () => {
		
		$scope.copyToClipboard($("#benefit").val());
	}
	
	$scope.previewImage = () => {
		
		$("#preview").toast("show");
	}
	
	$scope.saveStudent = () => {
		
		let result = isValidForm();
		
		if(result == null && $scope.isValidCpr($scope.student.cpr)){
			
			if($scope.config.transfer){
				
				let payment = new Object();
				payment.id = moment().valueOf();
				payment.cpr = $scope.student.cpr;
				payment.receiver = "بنفت";
				payment.amount = $scope.program.feesAmount;
				payment.selected = false;
				payment.url = $scope.student.payment;
				payment.time = moment().format("DD-MM-YYYY HH:mm:ss");
				
				$scope.setSilent("programs-payments/" + $scope.program.id + "/" + payment.cpr, payment);
				$scope.setSilent("programs-students-payments/" + payment.cpr + "/" + $scope.program.id, payment);
			}
			
			$scope.student.id = moment().valueOf();
			$scope.student.time = moment().format("DD-MM-YYYY HH:mm:ss");

			$scope.set("students-programs/" + $scope.student.cpr + "/" + $scope.program.id, $scope.student.time, ()=> {
				
				$scope.set("programs-students/" + $scope.program.id + "/" + $scope.student.cpr, $scope.student, "تم حفظ تسجيل الطالب بنجاح");
			});
		
		}else{
			
			$scope.danger(result);
		}
	}
});