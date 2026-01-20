application.controllerProvider.register("levels-comments", ($scope, $timeout) => {
	
	$scope.levels = new Object();
	$scope.level = localStorage.getItem("level") != null ? Number(localStorage.getItem("level")) : null;
	$scope.comments = new Object();
	$scope.comment = new Object();
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.updateLevel = () => {
		
		$scope.comments = new Object();
		
		if($scope.level != null){
			
			localStorage.setItem("level", $scope.level);
			
			$scope.getBySemester("levels-comments/" + $scope.level, comments => {
				$scope.comments = comments;
			});
		}
	}
	
	$scope.updateLevel();
	
	$scope.toAddComment = () =>{
		
		$scope.comment = new Object();
		$scope.comment.id = moment().valueOf();
		
		$timeout(()=> isValidForm());
	}
	
	$scope.toEditComment = comment =>{
		
		$scope.comment = $scope.copy(comment);
		
		$timeout(()=> isValidForm());
	}
	
	$scope.saveLevelComment = () => {

		$scope.comment.level = $scope.level;
		$scope.comment.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.saveResetBySemester("levels-comments/" + $scope.level + "/" + $scope.comment.id, $scope.comment, () => {
			
			$scope.success("تم حفظ الملاحظة بنجاح");
			
			$scope.comments[$scope.comment.id] = $scope.comment;
			
			$("#commentModal").modal("hide");
		});
	}
	
	$scope.selectComment = comment =>{
		$scope.comment = comment;
	}
	
	$scope.deleteComment = () =>{
		
		if($scope.isStringNotEmpty($scope.level)
			&& $scope.isStringNotEmpty($scope.course)){
			
			$scope.removeResetBySemester("levels-comments/" + $scope.level + "/" + $scope.comment.id, ()=> {
				
				$scope.success("تم حذف الملاحظة بنجاح");
				
				delete $scope.comments[$scope.comment.id];
			});
		}
	}
});