application.controllerProvider.register("view-trips-attend", ($scope, $timeout) => {
	
	$scope.trips = new Array();
	$scope.levels = new Object();
	$scope.students = new Object();
	$scope.trip = localStorage.getItem("trip") != null ? Number(localStorage.getItem("trip")) : null;
	$scope.attendance = new Array();
	$scope.search = new Object();
	$scope.matchedAttendance = new Array();
	
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
		$scope.searchStudents();
	});

	$scope.updateTrip = () => {
		
		$scope.attendance = new Array();
		
		if($scope.trip != null){
			
			localStorage.setItem("trip", $scope.trip);

			$scope.getArrayBySemester("trip-attend/" + $scope.trip, attendance =>{
				$scope.attendance = attendance;
				$scope.searchStudents();
			});
		}
	}
	
	$scope.updateTrip();
	
	$scope.searchStudents = ()=>{
		
		$scope.matchedAttendance = $scope.attendance.filter(attend => {
			
			let student = $scope.students[attend.cpr];
			
			if(student != null){
				
				return ($scope.isStringEmpty($scope.search.cpr) || student.cpr.toString().trim().includes($scope.search.cpr.trim()))
						&& ($scope.isStringEmpty($scope.search.name) || student.name.trim().includes($scope.search.name.trim()))
						&& ($scope.isStringEmpty($scope.search.mobile) || student.mobile.toString().trim().includes($scope.search.mobile.trim()))
						&& ($scope.isStringEmpty($scope.search.grade) || student.grade == $scope.search.grade)
						&& ($scope.isStringEmpty($scope.search.level) || student.level == $scope.search.level);
			}else{
				
				return true;
			}
		});	
	}
	
	$scope.exportToExcel = () =>{
		
		let trip = $scope.trips.find(trip => trip.id == $scope.trip);
		
		$scope.writeTableToExcel("attendance", "حضور " + trip.name);
	}
});