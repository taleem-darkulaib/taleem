application.controllerProvider.register("roles", ($scope, $timeout) => {

	$scope.menu = new Array();
	$scope.roles = new Object();
	$scope.role = new Object();
	$scope.functions = new Object();
	
	$scope.get("roles", roles => {

		$scope.roles = roles;
		
		$scope.values($scope.roles).forEach(role => {
			
			role.menu = new Object();
			
			if(role.functions == null){
				role.functions = new Array();
			}
		});
		
		$scope.updateMenu();
	});
	
	$scope.getArray("menu", menu => {

		$scope.menu = menu;
		
		$scope.updateMenu();
	});
	
	$scope.updateMenu = ()=> {
		
		if($scope.menu != null){
				
			$scope.menu.forEach(category => {
				
				if(category.functions != null){
					
					category.functions.forEach(menuFunction =>{
						
						$scope.functions[menuFunction.url] = menuFunction.title;
						
						$scope.values($scope.roles).forEach(role => {
							
							if(role.functions != null 
								&& role.functions.includes(menuFunction.url)){
								
								if(role.menu[category.title] == null){
									role.menu[category.title] = 0;
								}
								
								role.menu[category.title]++;
							}
						});
					});
				}
			});
		}
	}
	
	$scope.toAddRole = ()=> {

		$scope.info("يرجى ادخال معلومات الصلاحية");
		
		$scope.role = new Object();
		
		$scope.role.id = moment().valueOf();
		$scope.role.functions = new Array();
		
		$timeout(isValidForm);
	}
	
	$scope.toEditRole = role => {
		
		$scope.info("يمكنك تحديث معلومات الصلاحية");
		
		$scope.role = $scope.copy(role);
		
		if($scope.role.functions == null){
			$scope.role.functions = new Array();
		}
		
		$timeout(isValidForm);
	}
	
	$scope.generatePassword = () => {
		
		let keys = new Array();
		
		for(let i=0; i<=9; i++){
			keys.push(String(i));
		}
		
		for(let i='A'.charCodeAt(0); i<='Z'.charCodeAt(0); i++){
			keys.push(String.fromCharCode(i));
		}
		
		for(let i='a'.charCodeAt(0); i<='z'.charCodeAt(0); i++){
			keys.push(String.fromCharCode(i));
		}
		
		$scope.role.password = "";
		
		for(let i=1; i<=6; i++){
			
			$scope.role.password += keys[Math.floor(Math.random() * keys.length)];
		}
		
		$timeout(() => validateElement("#password"));
	}
	
	$scope.saveRole = () => {
		
		$scope.role.menu = new Object();
		$scope.role.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.menu.forEach(category => {

			if(category.functions != null){

				category.functions.forEach(menuFunction =>{

					if($scope.role.functions.includes(menuFunction.url)){

						if($scope.role.menu[category.title] == null){
							$scope.role.menu[category.title] = 0;
						}

						$scope.role.menu[category.title]++;
					}
				});
			}
		});

		$scope.saveReset("roles/" + $scope.role.id, $scope.role, ()=>{
			
			$scope.success("تم حفظ الصلاحية بنجاح");
			
			$scope.roles[$scope.role.id] = $scope.role;
			
			$("#roleModal").modal("hide");
		});
	}
	
	$scope.selectRole = role =>{
		$scope.role = role;
	}
	
	$scope.deleteRole = () =>{
		
		$scope.removeReset("roles/" + $scope.role.id, ()=> {
			
			$scope.success("تم حذف الصلاحية بنجاح");
			
			delete $scope.roles[$scope.role.id];
		});
	}
});