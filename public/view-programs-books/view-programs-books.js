application.controllerProvider.register("view-programs-books", ($scope, $timeout) => {
	
	$scope.students = new Object();
	$scope.books = new Array();
	$scope.programs = new Array();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.matchedBooks = new Array();
	$scope.search = new Object();
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
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

		$scope.students = new Object();
		$scope.books = new Array();
		
		if($scope.program != null && $scope.program.id != null){
			
			localStorage.setItem("program", $scope.program.id);
			
			$scope.get("programs-students/" + $scope.program.id, students => {
				$scope.students = students;
				$scope.searchStudents();
			});
			
			$scope.getArray("programs-books/" + $scope.program.id, books => {
				$scope.books = books.filter(book => book.selected);
				$scope.searchStudents();
			});
		}
	}
	
	$scope.searchStudents = ()=>{
		
		$scope.matchedBooks = $scope.books.filter(book => {
			
			let student = $scope.students[book.cpr];
			
			if(student != null){
				
				return ($scope.isStringEmpty($scope.search.cpr) || student.cpr.toString().trim().includes($scope.search.cpr.trim()))
						&& ($scope.isStringEmpty($scope.search.name) || student.name.trim().includes($scope.search.name.trim()))
						&& ($scope.isStringEmpty($scope.search.mobile) || student.mobile.toString().trim().includes($scope.search.mobile.trim()))
						&& ($scope.isStringEmpty($scope.search.grade) || student.grade == $scope.search.grade);
			}else{
				
				return true;
			}
		});	
	}
	
	$scope.exportToExcel = () =>{
		
		$scope.writeTableToExcel("books", "استلام الكتب");
	}
});