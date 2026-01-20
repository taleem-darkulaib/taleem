application.controllerProvider.register("trips-payments", ($scope, $timeout) => {
	
	$scope.trips = new Array();
	$scope.levels = new Object();
	$scope.students = new Object();
	$scope.trip = localStorage.getItem("trip") != null ? Number(localStorage.getItem("trip")) : null;
	$scope.payments = new Object();
	$scope.payment = new Object();
	$scope.search = new Object();
	$scope.matchedPayments = new Array();
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getArrayBySemester("trips", trips => {
		$scope.trips = trips;
	});
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getBySemester("students", students => {
		$scope.students = students;
		$scope.updateStudents();
	});
	
	$scope.updateTrip = () => {
		
		if($scope.trip != null){
			
			localStorage.setItem("trip", $scope.trip);
			
			$scope.payments = new Object();
			
			$scope.getArrayBySemester("trips-payments/" + $scope.trip, payments => {
				
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
						&& ($scope.isStringEmpty($scope.search.level) || student.level == $scope.search.level)
						&& ($scope.isStringEmpty($scope.search.payment) || student.payment == $scope.search.payment);
			}else{
				
				return true;
			}
		});	
	}
	
	$scope.updateTrip();
	
	$scope.selectPayment = payment => {
		$scope.payment = payment;
	}
	
	$scope.confirmPayment = () =>{
		
		$scope.payment.selected = true;
		$scope.payment.confirmTime = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.setSilentBySemester("trips-payments/" + $scope.trip + "/" + $scope.payment.cpr, $scope.payment);
		$scope.setSilentBySemester("trips-students-payments/" + $scope.payment.cpr + "/" + $scope.trip, $scope.payment);
	}
	
	$scope.exportToExcel = () =>{
		
		let trip = $scope.trips.find(trip => trip.id == $scope.trip);
		
		$scope.writeTableToExcel("payments", "دفع رسوم " + trip.name);
	}
});