application.controllerProvider.register("upload-archive", ($scope, $timeout) => {
	
	$scope.columns = new Array();
	$scope.upload = new Object();
	$scope.archive = new Object();
	$scope.students = new Object();
	$scope.rows = new Array();
	$scope.upgrade = false;
	$scope.action = "add";
	
	$scope.getBySemester("archive", archive => {
		$scope.archive = archive;
	});
	
	$scope.getBySemester("students", students => {
		$scope.students = students;
	});
	
	$scope.get("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$("#file").change(() => {
		
		if($scope.action == "replace"){
			$scope.archive = new Object();
		}
		
		$scope.readExcel("file", rows => {
			
			$scope.columns = rows[0];
			
			$scope.rows = rows.slice(1);
		});
	});
	
	$scope.updateArchive = () => {

		$scope.rows.forEach((row, rowIndex) => {
			
			let student = new Object();
			
			Object.entries($scope.upload).forEach(([property, column]) => {
				
				student[property] = row[$scope.columns.indexOf(column)] != null ? row[$scope.columns.indexOf(column)].toString() : null;
			});
			
			if(student.grade != null){
				
				let grades = $scope.values($scope.grades);
				
				let index = grades.findIndex(grade => grade.name == student.grade);
				
				if(index != -1){
					
					if($scope.upgrade && index != grades.length - 1){
					
						student.grade = grades[index + 1].id;
					
					}else{
						
						student.grade = grades[index].id;
					}
					
				}else{
					
					student.grade = null;
				}
			}
			
			if($scope.isValidCpr(student.cpr)){
				student.cpr = student.cpr.toString();
				$scope.archive[student.cpr] = student;
			}
		});
	}
	
	$scope.$watch("upload", () => {
		
		$scope.updateArchive();
		
	}, true);
	
	$scope.saveArchive = ()=>{
		
		$scope.saveBySemester("archive", $scope.archive, "تم حفظ مرجع تسجيل الطلبة بنجاح");
	}
});