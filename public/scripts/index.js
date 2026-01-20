application.controller("controller", ($scope, $timeout, $sce, $location, $route, $rootScope) =>{

	$rootScope.title = "معلومات الطالب";
	
	$rootScope.getValue("config/currentSemester", currentSemester =>{
		
		$rootScope.currentSemester = currentSemester;
		$rootScope.semesterPath = "semester-info/" + currentSemester + "/";

		application.routeProvider = application.routeProvider.when("/", {templateUrl:"./student-info/student-info.html?time=" + moment().valueOf()});
		
		let script = document.createElement("script");
		script.src = "./student-info/student-info.js?time=" + moment().valueOf();
		document.head.appendChild(script);
		
		script.onload = () =>{

			$route.reload();
		}
	});
});

application.controller("student-info", () => {
	$rootScope.loading = false;
	$rootScope.title = "معلومات الطالب";
});