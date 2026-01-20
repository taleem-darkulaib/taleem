application.controllerProvider.register("trips-payments", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.trips = new Array();
	$scope.students = new Array();
	$scope.trip = localStorage.getItem("trip") != null ? Number(localStorage.getItem("trip")) : null;
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.receiver = localStorage.getItem("receiver");
	$scope.tripStudents = new Array();
	$scope.tripLevels = new Array();
	$scope.fees = null;
	$scope.payments = new Object();
	$scope.attendance = new Object();
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updateStudents();
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {

		$scope.levels = levels;
		
		$scope.updateTrip(false);
	});
	
	$scope.getArrayBySemester("trips", trips => {

		$scope.trips = trips;
		
		$scope.updateTrip(false);
	});
	
	$scope.updateTrip = reset => {
		
		if($scope.trips != null
			&& $scope.levels != null
			&& $scope.trip != null){
			
			localStorage.setItem("trip", $scope.trip);
			
			let trip = $scope.trips.find(trip => trip.id == $scope.trip);
			
			if(trip != null){
				$scope.fees = trip.feesAmount;
				$scope.tripLevels = $scope.levels.filter(level => trip.levels.includes(level.id));
			}
			
			if(reset){
				
				$scope.getTripPayments();
				
				$scope.level = null;

				$timeout(()=> {
					$("#level").trigger("change");
					validateElement($("#level"));
				});
				
			}else{
				
				$scope.updateStudents();
			}
		}
	}
	
	$scope.getTripPayments = () => {
		
		if($scope.trip != null){
			
			$scope.payments = new Object();
			
			$scope.getBySemester("trips-payments/" + $scope.trip, payments => {

				$scope.payments = payments;
			});
		}
	}
	
	$scope.getTripPayments();
	
	$scope.updateReceiver = ()=> {
		
		localStorage.setItem("receiver", $scope.receiver);
	}
	
	$scope.updateLevel = () => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);
			
			$scope.attendance = new Object();
			
			$scope.getBySemester("night-attend/" + $scope.level, attendance =>{

				$scope.attendance = $scope.calculateLevelAttendanceMarks(attendance);
				
				console.log("attendance", $scope.attendance);
				
				$scope.updateStudents();
			});
		}
	}
	
	$scope.updateLevel();
	
	$scope.updateStudents = () => {
		
		console.log("updateStudents");
		console.log("level", $scope.level);
		console.log("trip", $scope.trip);
		
		if($scope.level != null && $scope.trip != null){
			
			let trip = $scope.trips.find(trip => trip.id == $scope.trip);
			
			console.log("trip ", trip);
			
			if(trip != null){
				
				$scope.tripStudents = $scope.students.filter(student => student.level == $scope.level 
																		&& ($scope.attendance[student.cpr] == null
																			|| $scope.attendance[student.cpr].statuses["النسبة"] >= trip.percent));
			}else{
				
				$scope.tripStudents = new Array();
			}
		}
	}
	
	$scope.updateStudentPayment = student =>{
		
		student.cpr = student.cpr.toString();
		
		if($scope.payments[student.cpr] != null){
			
			$scope.payments[student.cpr].id = moment().valueOf();
			$scope.payments[student.cpr].time = moment().format("DD-MM-YYYY HH:mm:ss");
			$scope.payments[student.cpr].receiver = $scope.receiver;
			$scope.payments[student.cpr].amount = Number($scope.fees);
			$scope.payments[student.cpr].cpr = student.cpr;
			$scope.payments[student.cpr].level = student.level;
			
			$scope.setSilentBySemester("trips-payments/" + $scope.trip + "/" + student.cpr, $scope.payments[student.cpr]);
			$scope.setSilentBySemester("trips-students-payments/" + student.cpr + "/" + $scope.trip, $scope.payments[student.cpr]);
		}
	}
});