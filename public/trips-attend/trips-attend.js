application.controllerProvider.register("trips-attend", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.trips = new Array();
	$scope.students = new Array();
	$scope.trip = localStorage.getItem("trip") != null ? Number(localStorage.getItem("trip")) : null;
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.tripLevels = new Array();
	$scope.tripStudents = new Array();
	$scope.attendance = new Object();
	$scope.payments = new Object();
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updateLevel();
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
				$scope.tripLevels = $scope.levels.filter(level => trip.levels.includes(level.id));
			}
			
			if(reset){
				
				$scope.getTripAttendPayment();
				
				$scope.level = null;

				$timeout(()=> {
					$("#level").trigger("change");
					validateElement($("#level"));
				});
			}
		}
	}
	
	$scope.getTripAttendPayment = () => {
		
		if($scope.trip != null){
			
			$scope.attendance = new Object();
			
			$scope.getBySemester("trip-attend/" + $scope.trip, attendance =>{

				$scope.attendance = attendance;
			});
			
			$scope.payments = new Object();
			
			$scope.getBySemester("trips-payments/" + $scope.trip, payments => {

				$scope.payments = payments;
			});
		}
	}
	
	$scope.getTripAttendPayment();
	
	$scope.updateLevel = () => {
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);

			$scope.tripStudents = $scope.students.filter(student => student.level == $scope.level);
		}
	}
	
	$scope.clickStudentAttend = (student, status) => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr] != null
			&& status == $scope.attendance[student.cpr].status){

			$scope.attendance[student.cpr] = null;
			
			$scope.removeSilentBySemester("trip-attend/" + $scope.trip + "/" + student.cpr, $scope.attendance[student.cpr]);
		}
	}
	
	$scope.updateStudentAttend = student => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr] != null){
			
			$scope.attendance[student.cpr].id = moment().valueOf();
			$scope.attendance[student.cpr].time = moment().format("DD-MM-YYYY HH:mm:ss");
			$scope.attendance[student.cpr].cpr = student.cpr;
			$scope.attendance[student.cpr].level = student.level;
			
			$scope.setSilentBySemester("trip-attend/" + $scope.trip + "/" + student.cpr, $scope.attendance[student.cpr]);
		}
	}
	
	$scope.attendAll = ()=>{
		
		$scope.tripStudents.forEach(student => {
			
			$scope.attendance[student.cpr] = {status:"حاضر"};
			
			$scope.updateStudentAttend(student);
		});
	}
});