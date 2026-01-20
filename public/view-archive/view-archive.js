application.controllerProvider.register("view-archive", ($scope, $timeout, $sce) => {
	
	$scope.grades = new Object();
	$scope.students = new Object();
	$scope.studentsSearch = new Array();
	$scope.archive = new Array();
	$scope.search = new Object();
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getBySemester("students", students =>{

		$scope.students = students;
		
		$scope.updateStudents();
	});
	
	$scope.getArrayBySemester("archive", archive =>{

		$scope.archive = archive;
		
		$scope.updateStudents();
	});
	
	$scope.updateStudents = () => {
		
		$scope.archive.forEach(student => {
			
			student.register = $scope.students[student.cpr] != null;
		});
		
		$scope.searchStudents();
	}
	
	$scope.searchStudents = ()=>{
		
		$scope.studentsSearch = $scope.archive.filter(student => {
			
			["cpr", "name", "mobile"].forEach(property => {
				if(student[property] == null){
					student[property] = "";
				}
			});
			
			return ($scope.isStringEmpty($scope.search.cpr) || student.cpr.toString().trim().includes($scope.search.cpr.trim()))
						&& ($scope.isStringEmpty($scope.search.name) || student.name.trim().includes($scope.search.name.trim()))
						&& ($scope.isStringEmpty($scope.search.mobile) || student.mobile.toString().trim().includes($scope.search.mobile.trim()))
						&& ($scope.isStringEmpty($scope.search.grade) || student.grade == $scope.search.grade)
						&& ($scope.isStringEmpty($scope.search.register) || student.register == $scope.search.register);
		});
	}
});