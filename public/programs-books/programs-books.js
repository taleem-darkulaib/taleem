application.controllerProvider.register("programs-books", ($scope, $timeout) => {
	
	$scope.students = new Array();
	$scope.books = new Object();
	$scope.programs = new Object();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	
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
			
			$scope.get("programs-books/" + $scope.program.id, books => {
				$scope.books = books;
			});
		}
	}
	
	$scope.updateStudentBook = student => {
		
		student.cpr = student.cpr.toString();
		
		$scope.books[student.cpr].id = moment().valueOf();
		$scope.books[student.cpr].cpr = student.cpr;
		$scope.books[student.cpr].time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.setSilent("programs-books/" + $scope.program.id + "/" + student.cpr, $scope.books[student.cpr]);
	}
});