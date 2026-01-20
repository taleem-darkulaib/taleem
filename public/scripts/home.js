application.controller("controller", ($scope, $timeout, $sce, $location, $rootScope, $route) =>{
	
	$rootScope.guides = guides;
	
	console.log("application.controller");
	
	sessionStorage.setItem("admin", true);
	
	$rootScope.admin = true;
	
	$scope.password = localStorage.getItem("password");
	
	$scope.category = null;
	$scope.function_ = null;
	$scope.categoryTitle = localStorage.getItem("category");
	$scope.functionTitle = localStorage.getItem("function");
	$scope.login = false;
	$scope.menu = new Array();
	$scope.roles = new Object();
	$scope.semesters = new Object();

	$scope.get("semesters", semesters =>{
		$scope.semesters = semesters;
	});
	
	application.routeProvider = application.routeProvider.when("/", {templateUrl:"./welcome/welcome.html"});
	
	$scope.getValue("config/currentSemester", currentSemester =>{
		
		$rootScope.currentSemester = currentSemester;
		$rootScope.semesterPath = "semester-info/" + currentSemester + "/";
		
		$scope.getArray("menu", menu => {

			$scope.menu = menu;
			
			menu.forEach(category => {
				
				if(category.functions != null){
					category.functions.forEach(menuFunction =>{
						application.routeProvider = application.routeProvider.when("/" + menuFunction.url, {templateUrl:"./" + menuFunction.url + "/" + menuFunction.url + ".html?time=" + moment().valueOf()});
					});
				}
			});
			
			if($location.path() == "/" && $scope.categoryTitle != null){
				
				$scope.category = menu.find(category => category.title == $scope.categoryTitle);
				
				if($scope.category != null
					&& $scope.category.functions != null
					&& $scope.functionTitle != null){
					
					$scope.function_ = $scope.category.functions.find(function_ => function_.title == $scope.functionTitle);
					
					console.log("$scope.function_", $scope.function_);
					
					$scope.selectFunction($scope.function_);
				}
			
			}else if($location.path() != "/"){
				
				$scope.category = menu.find(category => category.functions.find(function_ => function_.url == $location.path().substr(1)));
				
				if($scope.category != null
					&& $scope.category.functions != null){
					
					$scope.selectCategory($scope.category);
					
					$scope.function_ = $scope.category.functions.find(function_ => function_.url == $location.path().substr(1));
					
					$scope.selectFunction($scope.function_);
				}
			}
			
			$scope.updatePassword();
		});
	});
	
	$scope.getArray("roles", roles => {
		
		roles.forEach(role => $scope.roles[role.password] = role.functions);
		
		$scope.updatePassword();
	});
	
	$scope.selectSemester = ()=> {
		
		$rootScope.semesterPath = "semester-info/" + $rootScope.currentSemester + "/";
		
		$route.reload();
	}
	
	$scope.selectCategory = category => {
		
		if(category != null){
			
			$scope.category = category;
			
			localStorage.setItem("category", category.title);
			
			$scope.categoryTitle = category.title;
		}
	}
	
	$scope.selectFunction = function_ => {
		
		if(function_ != null){
			
			$scope.function_ = function_;
			
			$rootScope.title = function_.title;
			
			localStorage.setItem("function", function_.title);
			
			$scope.functionTitle = function_.title;
			
			if(!Array.from(document.getElementsByTagName("script")).some(script => script.src.includes("scripts/" + function_.url + ".js"))){

				const script = document.createElement("script");
				script.src = "./" + function_.url + "/" + function_.url + ".js?time=" + moment().valueOf();
				document.head.appendChild(script);
				
				script.onload = () =>{
					
					console.log($location.path());
					
					$timeout(() => {
						$location.path("/" + function_.url);
						$location.search("time", moment().valueOf());
					});
				}
			
			}else{
				
				$timeout(() => {
					$location.path("/" + function_.url);
					$location.search("time", moment().valueOf());
				});
			}
		}
	}
	
	$("#passwordModal").on("shown.bs.modal", ()=> {
		
		$("#password").focus();
	});
	
	$scope.updatePassword = ()=> {
		
		if($scope.password != null && $scope.roles[$scope.password] != null){
			
			$scope.login = true;
			
			localStorage.setItem("password", $scope.password);
			
			$("#passwordModal").modal("hide");
			
			let functions = $scope.roles[$scope.password];
			
			$scope.menu = $scope.menu.filter(category => {
				
				if(category.functions != null){
					category.functions = category.functions.filter(func => functions.includes(func.url));
				}
				
				return category.functions.length != 0;
			});
			
		}else{
			
			$scope.login = false;
			
			$("#passwordModal").modal("show");
		}
	}
	
	$scope.backToMenu = ()=> {
		
		$scope.function_ = null;
		$scope.functionTitle = null;
		
		localStorage.removeItem("function");
	}
	
	$scope.logout = ()=> {
		
		$scope.password = null;
		
		localStorage.removeItem("password");

		$("#passwordModal").modal("show");
	}
});