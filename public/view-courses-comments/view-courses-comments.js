application.controllerProvider.register("view-courses-comments", ($scope, $timeout) => {

	$scope.levels = new Object();
	$scope.courses = new Object();
	$scope.comments = new Array();
	$scope.search = new Object();
	$scope.uploadedCoursesComments = new Array();
	
	$scope.getBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.getArrayBySemester("courses-comments", levelsCoursesComments => {
		$scope.comments = levelsCoursesComments.flatMap(levelCoursesComments => $scope.values(levelCoursesComments).flatMap(courseComment => $scope.values(courseComment)));
		$scope.searchComments();
	});
	
	$scope.searchComments = ()=>{
		$scope.matchedComments = $scope.comments.filter(comment => {
			return ($scope.isStringEmpty($scope.search.level) || comment.level == $scope.search.level)
					&& ($scope.isStringEmpty($scope.search.course) || comment.course == $scope.search.course)
		});
	}
	
	$("#file").change(() => {
		
		$scope.readExcel("file", content => {
			
			let rows = content.slice(1);

			$scope.uploadedCoursesComments = rows.filter(cells => cells.every(cell => $scope.isStringNotEmpty(cell))).map((cells, index) => {
				
				let courseComment = new Object();
				courseComment.id = moment().valueOf() + index;
				courseComment.level = $scope.values($scope.levels).find(level => level.name == cells[1]).id;
				courseComment.course = $scope.values($scope.courses).find(course => course.name == cells[2]).id;
				courseComment.content = cells[3];
				courseComment.time = moment().format("DD-MM-YYYY HH:mm:ss");
				return courseComment;
			});
		});
	});
	
	$scope.uploadCoursesComments = ()=> {

		$scope.uploadedCoursesComments.forEach(courseComment => {

			$scope.setBySemester("courses-comments/" + courseComment.level + "/" + courseComment.course + "/" + courseComment.id, courseComment, ()=> {
				
				$scope.comments.push(courseComment);
				
				$scope.searchComments();
			});
		});
		
		$scope.success("تم حفظ ملاحظات المواد بنجاح");
	}
	
	$scope.exportToExcel = () =>{
		
		$scope.writeTableToExcel("comments", "ملاحظات المواد");
	}
});