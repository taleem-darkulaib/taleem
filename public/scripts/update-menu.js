application.controller("controller", ($scope, $timeout, $sce, $location) =>{
	
	$scope.icons = new Array();
	$scope.menu = new Array();
	$scope.category = null;
	
	$scope.getArray("icons", icons => {
		$scope.icons = icons;
	});
	
	$scope.getArray("menu", menu => {
		$scope.menu = menu;
	});
	
	$scope.addFunction = (category, index) => {
		
		let function_ = new Object();
		
		function_.icon = "bi-list";
		
		category.functions.splice(index, 0, function_);
		
		$timeout(isValidForm);
	}
	
	$scope.saveMenu = () =>{
		
		$scope.save("menu", $scope.menu, "تم حفظ القائمة بنجاح");
	}
});