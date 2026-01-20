application.controllerProvider.register("view-programs-payments", ($scope, $timeout) => {
	
	$scope.students = new Object();
	$scope.payments = new Object();
	$scope.programs = new Object();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.payment = new Object();
	$scope.matchedPayments = new Array();
	$scope.search = new Object();
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
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
		
		if($scope.program != null){
			
			$scope.get("programs-students/" + $scope.program.id, students => {
				$scope.students = students;
				$scope.updateStudents();
			});
			
			$scope.get("programs-payments/" + $scope.program.id, payments => {
				$scope.payments = payments;
				$scope.updateStudents();
			});
		}
	}
	
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
		
		$scope.setSilent("programs-payments/" + $scope.program.id + "/" + $scope.payment.cpr, $scope.payment);
		$scope.setSilent("programs-students-payments/" + $scope.payment.cpr + "/" + $scope.program.id, $scope.payment);
	}
	
	$scope.exportToExcel = () =>{
		
		let program = $scope.programs.find(program => program.id == $scope.program.id);
		
		$scope.writeTableToExcel("payments", "دفع رسوم " + program.name);
	}
});