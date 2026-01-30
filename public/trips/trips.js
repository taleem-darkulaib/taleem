application.controllerProvider.register("trips", ($scope, $timeout) => {
	
	$scope.levels = new Object();
	$scope.trips = new Object();
	$scope.trip = new Object();

	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getBySemester("trips", trips => {
		$scope.trips = trips;
	});
	
	$scope.toAddTrip = () => {

		$scope.info("يرجى ادخال معلومات الرحلة");
		
		$scope.trip = new Object();
		$scope.trip.id = moment().valueOf();
		$scope.trip.available = true;

		$timeout(()=>{
			flatpickr("#date", {dateFormat: "d-m-Y", disableMobile: true});
			isValidForm();
		});
	}
	
	$scope.toEditTrip = trip => {
		
		$scope.info("يمكنك تحديث معلومات الرحلة");
		
		$scope.trip = $scope.copy(trip);
		
		$timeout(()=>{
			flatpickr("#date", {dateFormat: "d-m-Y", disableMobile: true});
			isValidForm();
		});
	}
	
	$scope.saveTrip = () => {
		
		$scope.trip.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.saveResetBySemester("trips/" + $scope.trip.id, $scope.trip, ()=>{
			
			$scope.success("تم حفظ الرحلة بنجاح");
			
			$scope.trips[$scope.trip.id] = $scope.trip;
			
			$("#tripModal").modal("hide");
		});
	}
	
	$scope.selectTrip = trip =>{
		$scope.trip = trip;
	}
	
	$scope.deleteTrip = () =>{
		
		if($scope.isStringNotEmpty($scope.trip.id)){
			
			$scope.removeResetBySemester("trips/" + $scope.trip.id, ()=> {

				$scope.success("تم حذف الرحلة بنجاح");

				delete $scope.trips[$scope.trip.id];
			});
		}
	}
});