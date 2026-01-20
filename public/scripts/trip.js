application.controller("controller", ($route, $rootScope) =>{
	
	$rootScope.title = "الرحلات";
	
	$rootScope.getValue("config/currentSemester", currentSemester =>{
		
		$rootScope.currentSemester = currentSemester;
		$rootScope.semesterPath = "semester-info/" + currentSemester + "/";

		application.routeProvider = application.routeProvider.when("/", {templateUrl:"./trip-register/trip-register.html?time=" + moment().valueOf()});
		
		const script = document.createElement("script");
		script.src = "./trip-register/trip-register.js?time=" + moment().valueOf();
		document.head.appendChild(script);
		
		script.onload = ()=> {
			
			$route.reload();
		}
	});
});

application.controller("trip-register", ($rootScope) => {
	$rootScope.loading = false;
	$rootScope.title = "الرحلات";
});