application.controllerProvider.register("view-students-comments", ($scope, $timeout) => {

	$scope.levels = new Object();
	$scope.students = new Object();
	$scope.comments = new Array();
	$scope.search = new Object();
	$scope.matchedComments = new Array();
	$scope.comment = new Object();
	$scope.uploadedComments = new Array();
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getBySemester("students", students => {
		
		$scope.students = students;
		
		$scope.searchStudents();
	});
	
	$scope.getArrayBySemester("comments", comments => {
			
		$scope.comments = comments.flatMap(studentComments => $scope.values(studentComments));
		
		$scope.searchStudents();
	});
	
	$scope.searchStudents = ()=>{
		
		$scope.matchedComments = $scope.comments.filter(comment => {
			
			let student = $scope.students[comment.cpr];
			
			if(student != null){
				
				return ($scope.isStringEmpty($scope.search.cpr) || student.cpr.toString().trim().includes($scope.search.cpr.trim()))
							&& ($scope.isStringEmpty($scope.search.name) || student.name.trim().includes($scope.search.name.trim()))
							&& ($scope.isStringEmpty($scope.search.mobile) || student.mobile.toString().trim().includes($scope.search.mobile.trim()))
							&& ($scope.isStringEmpty($scope.search.grade) || student.grade == $scope.search.grade)
							&& ($scope.isStringEmpty($scope.search.level) || student.level == $scope.search.level)
							&& ($scope.isStringEmpty($scope.search.type) || comment.type == $scope.search.type);
			}else{
				
				return true;
			}
		});	
	}
	
	$scope.selectComment = comment =>{
		$scope.comment = comment;
	}
	
	$scope.deleteComment = () =>{
		
		if($scope.isStringNotEmpty($scope.comment.cpr)
			&& $scope.isStringNotEmpty($scope.comment.id)){
			
			$scope.removeBySemester("comments/" + $scope.comment.cpr + "/" + $scope.comment.id, ()=> {
				
				$scope.success("تم حذف الملاحظة بنجاح");
				
				$scope.comments.splice($scope.comments.indexOf($scope.comment), 1);
				
				$scope.searchStudents();
			});
		}
	}
	
	$("#file").change(() => {
		
		$scope.readExcel("file", content => {
			
			let rows = content.slice(1);

			$scope.uploadedComments = rows.filter(cells => cells.every(cell => $scope.isStringNotEmpty(cell))).map((cells, index) => {

				let studentComment = new Object();
				studentComment.id = moment().valueOf() + index;
				studentComment.cpr = cells[1];
				studentComment.level = $scope.students[studentComment.cpr].level;
				studentComment.type = cells[3];
				studentComment.content = cells[4];
				studentComment.time = moment().format("DD-MM-YYYY HH:mm:ss");
				return studentComment;
			});
		});
	});
	
	$scope.saveUploadedComments = ()=> {
		
		$scope.uploadedComments.forEach(comment => {
			
			$scope.setBySemester("comments/" + comment.cpr + "/" + comment.id, comment, ()=> {
				
				$scope.comments.push(comment);
				
				$scope.searchStudents();
		
				$scope.success("تم حفظ الملاحظات بنجاح");
			});
		});
	}
	
	$scope.exportToExcel = () =>{
		
		$scope.writeTableToExcel("comments", "ملاحظات الطلبة");
	}
});