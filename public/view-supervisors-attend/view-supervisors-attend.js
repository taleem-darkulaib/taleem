application.controllerProvider.register("view-supervisors-attend", ($scope, $timeout) => {
	
	$scope.supervisors = new Array();
	$scope.supervisor = new Object();
	$scope.supervisorsAttend = new Object();
	$scope.attendance = new Object();
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArray("supervisors", supervisors => {
		$scope.supervisors = supervisors;
	});

	$scope.getBySemester("supervisors-attend", supervisorsAttend =>{
		
		$scope.supervisorsAttend = supervisorsAttend;
		
		$scope.attendance = $scope.calculateMemberAttendance(supervisorsAttend);
	});

	$scope.selectSupervisor = supervisor => {
		$scope.supervisor = supervisor;
	}
	
	$scope.exportToExcel = () =>{
		
		let rows = new Array();
		
		rows.push(["#", "اسم المشرف", "حاضر", "غائب", "معتذر", "متأخر", "المجموع", "النسبة"]);
		
		$scope.supervisors.forEach((supervisor, index) => {
			
			if($scope.attendance[supervisor.id] != null){
				
				rows.push([index + 1, 
					supervisor.name,
					$scope.attendance[supervisor.id]["حاضر"],
					$scope.attendance[supervisor.id]["غائب"],
					$scope.attendance[supervisor.id]["معتذر"],
					$scope.attendance[supervisor.id]["متأخر"],
					$scope.attendance[supervisor.id]["المجموع"],
					$scope.attendance[supervisor.id]["النسبة"]
				]);
			
			}else{
				
				rows.push([index + 1, 
					supervisor.name,
					0,
					0,
					0,
					0,
					0,
					0
				]);
			}
		});
		
		$scope.writeExcel(rows, "حضور المشرفين");
	}
});