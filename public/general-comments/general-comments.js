application.controllerProvider.register("general-comments", ($scope, $timeout) => {
	
	$scope.semesters = new Array();
	$scope.sourceSemester = null;
	
	$scope.getArray("semesters", semesters =>{
		$scope.semesters = semesters.filter(semester => semester.id != $scope.currentSemester);
	});
	
	$scope.copyFromSemester = ()=> {
		
		$scope.get("semester-info/" + $scope.sourceSemester + "/general-comments", generalComments => {

			$scope.generalComments = $scope.copy(generalComments);
			
			$scope.setResetBySemester("general-comments", $scope.generalComments, "تم حفظ الملاحظات بنجاح");
		});
	}
	
	$scope.generalComments = new Object();
	$scope.generalComment = new Object();
	$scope.uploadedGeneralComments = new Array();
	
	$scope.getBySemester("general-comments", generalComments => {
		$scope.generalComments = generalComments;
	});
	
	$scope.toAddGeneralComment = generalComment =>{
		
		$scope.generalComment = new Object();
		$scope.generalComment.id = moment().valueOf();
		$scope.generalComment.active = true;
			
		$timeout(isValidForm);
	}
	
	$scope.toEditGeneralComment = generalComment =>{
		
		$scope.generalComment = $scope.copy(generalComment);
		
		$timeout(isValidForm);
	}
	
	$scope.saveGeneralComment = () => {
		
		$scope.generalComment.time = moment().format("DD-MM-YYYY HH:mm:ss");

		$scope.saveResetBySemester("general-comments/" + $scope.generalComment.id, $scope.generalComment, () => {
			
			$scope.generalComments[$scope.generalComment.id] = $scope.generalComment;
			
			$scope.success("تم حفظ الملاحظة بنجاح");
			
			$("#generalCommentModal").modal("hide");
		});
	}
	
	$scope.updateActive = generalComment => {
		
		$scope.generalComment.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.saveResetBySemester("general-comments/" + $scope.generalComment.id, $scope.generalComment, "تم تحديث حالة الملاحظة بنجاح");
	}
	
	$scope.selectGeneralComment = semester =>{
		$scope.semester = semester;
	}
	
	$scope.deleteGeneralComment = () =>{
		
		if($scope.isStringNotEmpty($scope.generalComment.id)){
			
			$scope.removeResetBySemester("general-comments/" + $scope.generalComment.id, ()=> {
				
				$scope.success("تم حذف الملاحظة بنجاح");
				
				delete $scope.generalComments[$scope.generalComment.id];
			});
		}
	}
	
	$("#file").change(() => {
		
		$scope.readExcel("file", content => {
			
			let rows = content.slice(1);

			$scope.uploadedGeneralComments = rows.filter(cells => cells.every(cell => $scope.isStringNotEmpty(cell))).map((cells, index) => {

				let generalComment = new Object();
				generalComment.id = moment().valueOf() + index;
				generalComment.content = cells[1];
				generalComment.time = moment().format("DD-MM-YYYY HH:mm:ss");
				return generalComment;
			});
		});
	});
	
	$scope.uploadGeneralComments = ()=> {
		
		$scope.uploadedGeneralComments.forEach(generalComment => {

			$scope.setBySemester("general-comments/" + generalComment.id, generalComment, ()=> {
				
				$scope.generalComments[generalComment.id] = generalComment;
			});
		});
		
		$scope.success("تم حفظ الملاحظات بنجاح");
	}
	
	$scope.exportToExcel = () =>{
		
		$scope.writeTableToExcel("comments", "الملاحظات العامة");
	}
});