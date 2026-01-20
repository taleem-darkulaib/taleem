application.controller("controller", ($scope, $timeout, $sce, $location, $route, $rootScope) =>{
	
	$rootScope.title = "التسجيل";
	
	$rootScope.getValue("config/currentSemester", currentSemester =>{
		
		$rootScope.currentSemester = currentSemester;
		$rootScope.semesterPath = "semester-info/" + currentSemester + "/";

		application.routeProvider = application.routeProvider.when("/", {templateUrl:"./student-register/student-register.html?time=" + moment().valueOf()});
		
		let script = document.createElement("script");
		script.src = "./student-register/student-register.js?time=" + moment().valueOf();
		document.head.appendChild(script);
		
		script.onload = () =>{

			$route.reload();
		}
	});
});

application.controller("student-register", () => {
	$rootScope.loading = false;
	$rootScope.title = "التسجيل";
});