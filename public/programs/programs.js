application.controllerProvider.register("programs", ($scope, $timeout) => {
	
	$scope.rooms = new Object();
	$scope.programs = new Object();
	$scope.program = new Object();
	
	$scope.get("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActive("rooms", rooms => {
		$scope.rooms = rooms;
	});

	$scope.get("programs", programs => {
		$scope.programs = programs;
	});
	
	$scope.toAddProgram = () => {

		$scope.info("يرجى ادخال معلومات البرنامج");
		
		$scope.program = new Object();
		$scope.program.id = moment().valueOf();
		$scope.program.comments = new Array();
		
		$scope.addComment(0);
		
		$timeout(()=>{
			flatpickr("#startDate", {dateFormat: "d-m-Y", disableMobile: true});
			flatpickr("#endDate", {dateFormat: "d-m-Y", disableMobile: true});
			isValidForm();
		});
	}
	
	$scope.toEditProgram = program => {
		
		$scope.info("يمكنك تحديث معلومات البرنامج");
		
		$scope.program = $scope.copy(program);
		
		if($scope.program.comments == null){
			
			$scope.program.comments = new Array();
		
			$scope.addComment(0);
		}
		
		$timeout(()=>{
			flatpickr("#startDate", {dateFormat: "d-m-Y", disableMobile: true});
			flatpickr("#endDate", {dateFormat: "d-m-Y", disableMobile: true});
			isValidForm();
		});
	}
	
	$scope.addComment = index => {
		
		let comment = new Object();
		comment.id = moment().valueOf();
		comment.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.program.comments.splice(index, 0, comment);
		
		$timeout(()=> $("input[name='comments']").eq(index).focus());
	}
	
	$scope.deleteComment = index => {
		
		$scope.program.comments.splice(index, 1);
	}
	
	$scope.saveProgram = () => {
		
		$scope.program.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.saveReset("programs/" + $scope.program.id, $scope.program, ()=>{
			
			$scope.success("تم حفظ البرنامج بنجاح");
			
			$scope.programs[$scope.program.id] = $scope.program;
			
			$("#programModal").modal("hide");
		});
	}
	
	$scope.selectProgram = program =>{
		$scope.program = program;
	}
	
	$scope.deleteProgram = () =>{
		
		$scope.removeReset("programs/" + $scope.program.id, ()=> {
			
			$scope.success("تم حذف البرنامج بنجاح");
			
			delete $scope.programs[$scope.program.id];
		});
	}
});