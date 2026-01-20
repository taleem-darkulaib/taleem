application.controllerProvider.register("config", ($scope, $timeout) => {
	
	$scope.config = new Object();
	$scope.fields = [
		{property:"contact", title:"رقم التواصل", required:false},
		{property:"dateOfBirth", title:"تاريخ الميلاد", required:false},
		{property:"health", title:"الحالة الصحية", required:false},
		{property:"city", title:"منطقة السكن", required:false, required:false},
		{property:"block", title:"رقم المجمع", required:false},
		{property:"photo", title:"الصورة الشخصية", required:false},
		{property:"mother", title:"اسم الأم", required:false}
	];
	
	$scope.get("config", config =>{
		$scope.config = config;
		
		if($scope.config.comments == null){
			$scope.config.comments = new Array();
			$scope.addComment();
		}
	});
	
	$scope.get("labels", labels =>{
		if($scope.isListNotEmpty(labels)){
			$scope.labels = labels;
		}
	});
	
	$("#logo").change(() =>{
							
		$scope.config.logo = $scope.getImage("logo");
		
		$scope.upload("logo.jpg", "logo", url => {
			
			$scope.config.logo = url;
		});
	});
	
	$scope.addComment = index => {
		
		let comment = new Object();
		comment.id = moment().valueOf();
		comment.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.config.comments.splice(index, 0, comment);
		
		$timeout(()=> $("input[name='comments']").eq(index).focus());
	}
	
	$scope.deleteComment = index => {
		
		$scope.config.comments.splice(index, 1);
	}
	
	$scope.previewImage = ()=> {

		$("#preview").toast("show");
	}
	
	$scope.saveConfigurations = () =>{
		
		$scope.set("config", $scope.config, ()=> {
			
			$scope.save("labels", $scope.labels, "تم حفظ اعدادات الفصل بنجاح");
		});
	}
});