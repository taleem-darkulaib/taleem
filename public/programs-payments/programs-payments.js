application.controllerProvider.register("programs-payments", ($scope, $timeout) => {
	
	$scope.students = new Array();
	$scope.payments = new Object();
	$scope.programs = new Object();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.receiver = localStorage.getItem("receiver");
	$scope.fees = 0;
	
	$scope.getArray("programs", programs => {
		$scope.programs = programs;
		if($scope.programs.length == 1){
			$scope.program = $scope.programs[0];
		}
		$scope.updateProgram();
	});
	
	$scope.updateProgram = () => {
		
		if($scope.program != null && $scope.program.id != null){
			
			$scope.program = $scope.programs.find(program => program.id == $scope.program.id);
			
			localStorage.setItem("program", $scope.program.id);
			
			$scope.fees = $scope.program.feesAmount;
			
			$scope.getArray("programs-students/" + $scope.program.id, students => {
				$scope.students = students;
			});
			
			$scope.get("programs-payments/" + $scope.program.id, payments => {
				$scope.payments = payments;
			});
		}
	}
	
	$scope.updateReceiver = () => {
		
		localStorage.setItem("receiver", $scope.receiver);
	}
	
	$scope.updateStudentPayment = student => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.payments[student.cpr] != null){
			
			$scope.payments[student.cpr].id = moment().valueOf();
			$scope.payments[student.cpr].cpr = student.cpr;
			$scope.payments[student.cpr].time = moment().format("DD-MM-YYYY HH:mm:ss");
			$scope.payments[student.cpr].receiver = $scope.receiver;
			$scope.payments[student.cpr].amount = Number($scope.fees);
			
			$scope.setSilent("programs-payments/" + $scope.program.id + "/" + student.cpr, $scope.payments[student.cpr]);
			$scope.setSilent("programs-students-payments/" + student.cpr + "/" + $scope.program.id, $scope.payments[student.cpr]);
		}
	}
});