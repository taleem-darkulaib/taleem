application.controllerProvider.register("programs-attend", ($scope, $timeout) => {
	
	$scope.students = new Array();
	$scope.programs = new Array();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.dates = new Array();
	$scope.date = moment().format("DD-MM-YYYY");
	$scope.night = ((moment($scope.date, "DD-MM-YYYY").day() + 1) % 7) + 1;
	$scope.attendance = new Object();
	
	for(let i=-90; i<=30; i++){
		$scope.dates.push(moment().add(i, "days").format("DD-MM-YYYY"));
	}
	
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
			
			$scope.get("programs-night-attend/" + $scope.program.id + "/" + $scope.date, attendance => {
				$scope.attendance = attendance;
			});
		}
	}
	
	$scope.previousDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").subtract(1, "days").format("DD-MM-YYYY");
		
		$timeout(()=> $("#date").trigger("change"));
		
		$scope.updateDate();
	}
	
	$scope.nextDate = () => {
		
		$scope.date = moment($scope.date, "DD-MM-YYYY").add(1, "days").format("DD-MM-YYYY");
		
		$timeout(()=> $("#date").trigger("change"));
		
		$scope.updateDate();
	}
	
	$scope.updateDate = () => {
		
		$scope.night = ((moment($scope.date, "DD-MM-YYYY").day() + 1) % 7) + 1;
		
		$scope.updateProgram();
	}
	
	$scope.updateStudentAttend = student => {
		
		student.cpr = student.cpr.toString();
		
		$scope.setSilent("programs-night-attend/" + $scope.program.id + "/" + $scope.date + "/" + student.cpr, $scope.attendance[student.cpr]);
		$scope.setSilent("programs-attend/" + $scope.program.id + "/" + student.cpr + "/" + $scope.date, $scope.attendance[student.cpr]);
	}
	
	$scope.attendAll = ()=>{
		
		$scope.students.forEach(student => {
			
			student.cpr = student.cpr.toString();

			$scope.attendance[student.cpr] = {status:"حاضر"};
			
			$scope.updateStudentAttend(student);
		});
	}
});