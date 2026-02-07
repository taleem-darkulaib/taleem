application.controllerProvider.register("semesters", ($scope, $timeout, $rootScope) => {
	
	$scope.semesters = new Object();
	$scope.semester = new Object();
	$scope.fields = [
		{
			title:"المستويات",
			path:"levels",
			selected: true
		},
		{
			title:"مواد المستويات",
			path:"levels-courses",
			selected: true
		},
		{
			title:"توزيع المستويات",
			path:"distributions",
			selected: true
		},
		{
			title:"الطلبة",
			path:"students",
			selected: true
		},
		{
			title:"الملاحظات العامة",
			path:"general-comments",
			selected: true
		},
		{
			title:"توزيع الدرجات",
			path:"marksDistribution",
			selected: true
		},
		{
			title:"التقسيمات",
			path:"groups",
			selected: true
		},
		{
			title:"التقييمات",
			path:"evaluations",
			selected: true
		}
	];
	
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
		
		if($scope.semester.time == null && $scope.semester.dependent != null){
			
			let fields = $scope.fields.filter(field => field.selected);
			
			fields.forEach(field => {
				
				$scope.get("semester-info/" + $scope.semester.dependent + "/" + field.path, list => {
					$scope.set("semester-info/" + $scope.semester.id + "/" + field.path, list);
				});
			});
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