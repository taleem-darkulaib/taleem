application.controllerProvider.register("view-levels-comments", ($scope, $timeout) => {
	
	$scope.levels = new Object();
	$scope.comments = new Array();
	$scope.matchedComments = new Array();
	$scope.level = null;
	$scope.uploadedLevelsComments = new Array();
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.getArrayBySemester("levels-comments", comments => {
		$scope.comments = comments.flatMap(levelComments => $scope.values(levelComments));
		$scope.searchComments();
	});
	
	$scope.searchComments = ()=>{
		$scope.matchedComments = $scope.comments.filter(comment => $scope.isStringEmpty($scope.level) || comment.level == $scope.level);
	}
	
	$("#file").change(() => {
		
		$scope.readExcel("file", content => {
			
			let rows = content.slice(1);

			$scope.uploadedLevelsComments = rows.filter(cells => cells.every(cell => $scope.isStringNotEmpty(cell))).map((cells, index) => {
				
				let levelComment = new Object();
				levelComment.id = moment().valueOf() + index;
				levelComment.level = $scope.values($scope.levels).find(level => level.name == cells[1]).id;
				levelComment.content = cells[2];
				levelComment.time = moment().format("DD-MM-YYYY HH:mm:ss");
				return levelComment;
			});
		});
	});
	
	$scope.uploadLevelsComments = ()=> {

		$scope.uploadedLevelsComments.forEach(levelComment => {

			$scope.setBySemester("levels-comments/" + levelComment.level + "/" + levelComment.id, levelComment, ()=> {

				$scope.comments.push(levelComment);
				
				$scope.searchComments();
			});
		});
		
		$scope.success("تم حفظ ملاحظات " + $scope.labels.levels + " بنجاح");
	}
	
	$scope.exportToExcel = () =>{
		
		$scope.writeTableToExcel("comments", "ملاحظات " + $scope.labels.levels);
	}
});