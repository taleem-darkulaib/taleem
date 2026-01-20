application.controllerProvider.register("grades", ($scope, $timeout) => {
	
	$scope.get("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});

	$scope.saveGrades = () => {
		$scope.save("grades", $scope.grades, "تم حفظ قائمة الصفوف بنجاح");
	}
});