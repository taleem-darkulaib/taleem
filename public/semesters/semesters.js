application.controllerProvider.register("semesters", ($scope, $timeout, $rootScope) => {
	
	$scope.semesters = new Object();
	$scope.semester = new Object();
	
	$scope.get("semesters", semesters =>{
		$scope.semesters = semesters;
	});
	
	$scope.toAddSemester = () => {

		$scope.info("يرجى ادخال معلومات الفصل");
		
		$scope.semester = new Object();
		$scope.semester.id = moment().valueOf();
		$scope.semester.limit = 30;
		
		$timeout(isValidForm);
	}
	
	$scope.toEditSemester = semester => {
		
		$scope.info("يمكنك تحديث معلومات الفصل");
		
		$scope.semester = $scope.copy(semester);
		
		if($scope.semester.limit == null){
			$scope.semester.limit = 30;
		}
		
		$timeout(isValidForm);
	}
	
	$scope.saveSemester = () => {
		
		delete $scope.semester["$$hashKey"];
		
		if($scope.semester.fees != null && !isNaN($scope.semester.fees)){
			$scope.semester.fees = Number($scope.semester.fees);
		}
		
		$scope.semester.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.saveReset("semesters/" + $scope.semester.id, $scope.semester, ()=> {
			
			$scope.success("تم حفظ الفصل بنجاح");
			
			$scope.semesters[$scope.semester.id] = $scope.semester;
			
			$("#semesterModal").modal("hide");
			
			if($scope.semester.current){
				$scope.updateCurrent($scope.semester);
			}
		});
	}
	
	$scope.updateCurrent = selectedSemester =>{
		
		delete selectedSemester["$$hashKey"];
		
		if(selectedSemester.current){
			
			$scope.values($scope.semesters).forEach(semester => {
				
				if(semester != selectedSemester){
					semester.current = false;
				}
			});
			
			$rootScope.currentSemester = selectedSemester.id;
			
			$scope.setSilent("config/currentSemester", selectedSemester.id);
		}
		
		$scope.values($scope.semesters).forEach(semester => delete semester["$$hashKey"]);
		
		$scope.setReset("semesters", $scope.semesters, "تم حفظ الفصل الحالي بنجاح");
	}
	
	$scope.selectSemester = semester =>{
		$scope.semester = semester;
	}
	
	$scope.deleteSemester = () =>{
		
		$scope.removeReset("semesters/" + $scope.semester.id, ()=> {
			
			$scope.success("تم حذف الفصل بنجاح");
			
			delete $scope.semesters[$scope.semester.id];
		});
	}
});