application.controllerProvider.register("upload-students", ($scope, $timeout) => {
	
	$scope.grades = new Object();
	$scope.columns = new Array();
	$scope.upload = new Object();
	$scope.levels = new Object();
	$scope.students = new Array();
	$scope.rows = new Array();
	$scope.upgrade = false;
	$scope.action = "add";
	
	$scope.get("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getArrayBySemester("students", students => {
		$scope.students = students;
	});
	
	$("#file").change(() => {
		
		if($scope.action == "replace"){
			$scope.students = new Object();
		}
		
		$scope.readExcel("file", rows => {
			
			$scope.columns = rows[0];
			
			$scope.rows = rows.slice(1);
		});
	});
	
	$scope.updateStudents = () => {
		
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
			
			if(student.level != null){

				let level = $scope.values($scope.levels).find(level => level.name == student.level);
				
				student.level = level != null ? level.id : null;
			}
			
			if($scope.isValidCpr(student.cpr)){
				student.cpr = student.cpr.toString();
				$scope.students[student.cpr] = student;
			}
		});
	}
	
	$scope.$watch("upload", () => {
		
		$scope.updateStudents();
		
	}, true);
	
	$scope.saveStudents = () => {
		
		$scope.saveBySemester("students", $scope.students, "تم حفظ قائمة الطلبة بنجاح");
	}
});