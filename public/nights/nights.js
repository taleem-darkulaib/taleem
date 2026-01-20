application.controllerProvider.register("nights", ($scope, $timeout) => {
	
	$scope.addLabel = {
		"اليوم":"يوم",
		"الليلة":"ليلة",
	};
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.addNight = ()=> {
							
		let night = new Object();
		
		night.id = $scope.length($scope.nights) + 1;
		night.time = moment().format("DD-MM-YYYY HH:mm:ss");
		night.active = true;
		
		$scope.nights[night.id] = night;
		
		$timeout(()=> $("input[name='nights']:last").focus());
	}

	$scope.saveNights = () => {
		
		$scope.save("nights", $scope.nights, "تم حفظ قائمة الليالي بنجاح");
	}
});