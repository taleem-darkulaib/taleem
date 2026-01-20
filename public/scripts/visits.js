application.controller("controller", ($scope, $rootScope) =>{
	
	$scope.levels = new Object();
	$scope.visits = new Array();
	
	$scope.getValue("config/currentSemester", currentSemester => {
		
		$rootScope.currentSemester = currentSemester;
		$rootScope.semesterPath = "semester-info/" + $rootScope.currentSemester + "/";
		
		$scope.getBySemester("levels", levels => {
			$scope.levels = levels;
		});
		
		$scope.onUpdateArray("visits", visits => {
			$scope.visits = visits;
		});
	});

	$scope.deleteVisits = ()=>{
		
		$scope.remove("visits", "تم حذف الزيارات بنجاح");
	}
});