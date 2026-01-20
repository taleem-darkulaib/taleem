application.controllerProvider.register("nights-supervisors", ($scope, $timeout) => {
	
	$scope.areas = new Array();
	$scope.supervisors = new Array();
	$scope.nightSupervisors = new Object();
	$scope.night = localStorage.getItem("night") != null ? Number(localStorage.getItem("night")) : null;

	$scope.getActiveArray("supervisors", supervisors => {
		$scope.supervisors = supervisors;
	});
	
	$scope.getActiveArray("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
		$scope.updateNight();
	});
	
	$scope.getActiveArray("areas", areas => {
		$scope.areas = areas;
		$scope.updateNight();
	});
	
	$scope.updateNight = () => {

		if($scope.night != null){

			localStorage.setItem("night", $scope.night);
			
			if($scope.isListNotEmpty($scope.nights)
				&& $scope.isListNotEmpty($scope.areas)){
				
				$scope.getBySemester("nights-supervisors/" + $scope.night, nightSupervisors => {

					$scope.nightSupervisors = nightSupervisors;

					$scope.nights.forEach(night => {

						$scope.areas.forEach((area, areaIndex) => {

							if($scope.nightSupervisors[area.id] == null){

								$scope.nightSupervisors[area.id] = new Array();
								
								$scope.addSupervisor(area, 0);
							}
						});
					});
				});
			}
		}
	}
	
	$scope.addSupervisor = (area, areaIndex, index) => {
		
		let supervisors = $scope.nightSupervisors[area.id];
		
		supervisors.splice(index, 0, null);
		
		$timeout(()=>{
			isValidForm();
			$("#area" + areaIndex + "_supervisor" + index).focus();
		});
	}
	
	$scope.upSupervisor = (area, index) => {
		
		let supervisors = $scope.nightSupervisors[area.id];
		
		[supervisors[index], supervisors[index - 1]] = [supervisors[index - 1], supervisors[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.downSupervisor = (area, index) => {
		
		let supervisors = $scope.nightSupervisors[area.id];
		
		[supervisors[index], supervisors[index + 1]] = [supervisors[index + 1], supervisors[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.deleteSupervisor = (area, index) => {
		
		let supervisors = $scope.nightSupervisors[area.id];
		
		supervisors.splice(index, 1);
		
		$timeout(isValidForm);
	}
	
	$scope.saveNightSupervisors = () => {
		
		$scope.saveResetBySemester("nights-supervisors/" + $scope.night, $scope.nightSupervisors, "تم حفظ مشرفي الليلة بنجاح");
	}
});