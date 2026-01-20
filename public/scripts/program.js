application.controller("controller", ($route, $rootScope) =>{
	
	$rootScope.title = "البرامج";
	
	application.routeProvider = application.routeProvider.when("/", {templateUrl:"./program-register/program-register.html?time=" + moment().valueOf()});
	
	const script = document.createElement("script");
	script.src = "./program-register/program-register.js?time=" + moment().valueOf();
	document.head.appendChild(script);
	
	script.onload = ()=> {
		
		$route.reload();
	}
});

application.controller("program-register", ($rootScope) => {
	$rootScope.loading = false;
	$rootScope.title = "البرامج";
});