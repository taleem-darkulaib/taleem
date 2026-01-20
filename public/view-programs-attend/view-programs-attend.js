application.controllerProvider.register("view-programs-attend", ($scope, $timeout) => {
	
	$scope.students = new Array();
	$scope.programs = new Array();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.studentsAttend = new Object();
	$scope.attendance = new Object();
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
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
		
		if($scope.program != null && $scope.program.id != null){
			
			localStorage.setItem("program", $scope.program.id);
			
			$scope.getArray("programs-students/" + $scope.program.id, students => {
				$scope.students = students;
			});
			
			$scope.attendance = new Object();

			$scope.get("programs-attend/" + $scope.program.id, studentsAttend => {
				
				$scope.studentsAttend = studentsAttend;
				
				$scope.attendance = $scope.calculateMemberAttendance(studentsAttend);
			});
		}
	}
	
	$scope.selectStudent = student => {
		$scope.student = student;
	}
});