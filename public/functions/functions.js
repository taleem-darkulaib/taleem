application.controllerProvider.register("functions", ($scope, $timeout) => {
	
	$scope.icons = new Array();
	$scope.menu = new Array();
	$scope.category = null;
	$scope.function = null;
	
	$scope.getArray("icons", icons => {
		$scope.icons = icons;
	});
	
	$scope.getArray("menu", menu => {
		$scope.menu = menu;
	});
	
	$scope.addCategory = index => {
		
		let category = new Object();
		
		category.id = moment().valueOf();
		category.icon = "bi-folder";
		category.functions = new Array();
		category.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.menu.splice(index, 0, category);
		
		$timeout(()=> {
			$("input[name='categoryTitles']").eq(index).focus();
			isValidForm();
		});
	}
	
	$scope.deleteCategory = index => {
		
		$scope.menu.splice(index, 1);
		
		$timeout(isValidForm);
	}
	
	$scope.upCategory = index => {
		
		[$scope.menu[index - 1], $scope.menu[index]] = [$scope.menu[index], $scope.menu[index - 1]];
		
		$timeout(isValidForm);
	}
	
	$scope.downCategory = index => {
			
		[$scope.menu[index], $scope.menu[index + 1]] = [$scope.menu[index + 1], $scope.menu[index]];
		
		$timeout(isValidForm);
	}
	
	$scope.selectCategory = category => {
		
		$scope.category = category;
		$scope.function = null;
	}
	
	$scope.selectFunction = function_ => {
		
		$scope.function = function_;
		$scope.category = null;
	}
	
	$scope.selectIcon = icon => {
		
		if($scope.category != null){
			$scope.category.icon = icon;
		}else if($scope.function != null){
			$scope.function.icon = icon;
		}
	}
	
	$scope.moveToCategory = selectedCategory => {
		
		if(selectedCategory.functions == null){
			selectedCategory.functions = new Array();
		}
		
		$scope.menu.forEach(category => {
			
			if(selectedCategory != category
				&& category.functions != null){
				
				for(let i=category.functions.length - 1; i>=0; i--){
					
					let func = category.functions[i];
					
					if(func.selected){
						
						func.selected = false;
						
						selectedCategory.functions.push(func);
						
						category.functions.splice(i, 1);
					}
				}
			}
		});
	}
	
	$scope.upFunction = function(category, index){
		
		[category.functions[index - 1], category.functions[index]] = [category.functions[index], category.functions[index - 1]];
	}
	
	$scope.downFunction = function(category, index){
		
		[category.functions[index], category.functions[index + 1]] = [category.functions[index + 1], category.functions[index]];
	}
	
	$scope.saveMenu = () =>{
		
		$scope.save("menu", $scope.menu, "تم حفظ القائمة بنجاح");
	}
});