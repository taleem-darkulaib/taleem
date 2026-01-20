application.controllerProvider.register("view-books", ($scope, $timeout) => {

	$scope.levels = new Object();
	$scope.courses = new Object();
	$scope.students = new Object();
	$scope.books = new Array();
	$scope.search = new Object();
	$scope.matchedBooks = new Array();
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getActive("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.getBySemester("students", students => {
		
		$scope.students = students;
		
		$scope.searchStudents();
	});
	
	$scope.getArrayBySemester("books", books => {
		
		$scope.books = books.flatMap(studentBooks => $scope.values(studentBooks));
		
		$scope.searchStudents();
	});
	
	$scope.searchStudents = ()=>{
		
		$scope.matchedBooks = $scope.books.filter(book => {
			
			let student = $scope.students[book.cpr];
			
			if(student != null){
				
				return ($scope.isStringEmpty($scope.search.cpr) || student.cpr.toString().trim().includes($scope.search.cpr.trim()))
						&& ($scope.isStringEmpty($scope.search.name) || student.name.trim().includes($scope.search.name.trim()))
						&& ($scope.isStringEmpty($scope.search.mobile) || student.mobile.toString().trim().includes($scope.search.mobile.trim()))
						&& ($scope.isStringEmpty($scope.search.grade) || student.grade == $scope.search.grade)
						&& ($scope.isStringEmpty($scope.search.level) || student.level == $scope.search.level)
						&& ($scope.isStringEmpty($scope.search.course) || book.course == $scope.search.course);

			}else{
				
				return true;
			}
		});
	}
	
	$scope.exportToExcel = () =>{
		
		$scope.writeTableToExcel("books", "استلام الكتب");
	}
});