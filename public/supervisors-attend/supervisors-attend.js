application.controllerProvider.register("supervisors-attend", ($scope, $timeout) => {
	
	$scope.areas = new Array();
	$scope.supervisors = new Array();
	$scope.nightsSupervisors = new Object();
	$scope.otherSupervisors = new Array();
	$scope.dates = new Array();
	$scope.date = moment().format("DD-MM-YYYY");
	$scope.today = moment().format("DD-MM-YYYY");
	$scope.night = ((moment($scope.date, "DD-MM-YYYY").day() + 1) % 7) + 1;
	$scope.attendance = new Object();
	
	for(let i=-30; i<=30; i++){
		$scope.dates.push(moment().add(i, "days").format("DD-MM-YYYY"));
	}
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArray("areas", areas => {
		
		$scope.areas = areas;
		
		$scope.updateSupervisors();
	});
	
	$scope.getArray("supervisors", supervisors => {

		$scope.supervisors = supervisors;
		
		$scope.updateSupervisors();
	});
	
	$scope.getBySemester("nights-supervisors", nightsSupervisors => {

		$scope.nightsSupervisors = nightsSupervisors;
		
		$scope.updateSupervisors();
	});
	
	$scope.updateSupervisors = ()=>{
		
		$scope.areas.forEach(area => area.supervisors = $scope.supervisors.filter(supervisor => $scope.nightsSupervisors[$scope.night] != null && $scope.nightsSupervisors[$scope.night][area.id] != null && $scope.nightsSupervisors[$scope.night][area.id].includes(supervisor.id)));
		
		let supervisors = $scope.values($scope.nightsSupervisors[$scope.night]).flatMap(areaSupervisors => $scope.values(areaSupervisors));
		
		$scope.otherSupervisors = $scope.supervisors.filter(supervisor => !supervisors.includes(supervisor.id));
	}
	
	$scope.getAttendance = () => {

		$scope.attendance = new Object();
		
		$scope.getBySemester("supervisors-night-attend/" + $scope.date, attendance => {
				
			$scope.attendance = attendance;
		});
	}
	
	$scope.getAttendance();
	
	$scope.previousDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").subtract(1, "days").format("DD-MM-YYYY");
		
		$scope.updateDate();
		
		$timeout(()=> $("#date").trigger("change"));
	}
	
	$scope.nextDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").add(1, "days").format("DD-MM-YYYY");
		
		$scope.updateDate();
		
		$timeout(()=> $("#date").trigger("change"));
	}
	
	$scope.updateDate = () => {
		
		$scope.night = ((moment($scope.date, "DD-MM-YYYY").day() + 1) % 7) + 1;
		
		$scope.getAttendance();
	}
	
	$scope.updateSupervisorAttend = supervisor => {
		
		if($scope.attendance[supervisor.id] != null){
			
			$scope.setSilentBySemester("attendance-monitor/" + $scope.today + "/supervisors", moment().format("DD-MM-YYYY HH:mm:ss"));
			$scope.setSilentBySemester("supervisors-night-attend/" + $scope.date + "/" + supervisor.id, $scope.attendance[supervisor.id]);
			$scope.setSilentBySemester("supervisors-attend/" + supervisor.id + "/" + $scope.date, $scope.attendance[supervisor.id]);
		}
	}
	
	$scope.clickSupervisorAttend = (supervisor, status) => {
		
		if($scope.attendance[supervisor.id] != null
			&& status == $scope.attendance[supervisor.id].status){
			
			$scope.attendance[supervisor.id] = null;
			
			$scope.removeSilentBySemester("supervisors-night-attend/" + $scope.date + "/" + supervisor.id);
			$scope.removeSilentBySemester("supervisors-attend/" + supervisor.id + "/" + $scope.date);
		}
	}
});