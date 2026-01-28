application.controllerProvider.register("update-level", ($scope, $timeout, $http) => {

	$scope.levels = new Object();
	$scope.grade = null;
	$scope.level = null;
	
	$scope.getActive("grades", grades => {

		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
		
		$scope.getActiveBySemester("levels", levels => {
			
			$scope.levels = levels;
			
			$scope.getBySemester("distributions", distributions => {
				
				$scope.values($scope.grades).forEach(grade => grade.levels = $scope.values(levels).filter(level => distributions[grade.id] != null
																													&& distributions[grade.id].includes(level.id)));
			});
		});
		
		$scope.getArrayBySemester("students", students => {
			
			$scope.values($scope.grades).forEach(grade => grade.students = students.filter(student => student.grade == grade.id));
		});
	});

	$scope.updateGrade = () => {
		
		$scope.level = null;
		
		$timeout(()=> {
			
			$("#level").trigger("change");
			window.validateElement($("#level"));
		});
	}
	
	$scope.updateLevel = () => {
		
		$scope.grade.students.filter(student => student.selected).forEach(student => {
			
			let oldLevel = student.level;
			
			student.level = $scope.level;
			student.selected = false;
			
			$scope.setResetBySemester("students/" + student.cpr + "/level", $scope.level, "تم تحديث مستوى الطلبة بنجاح");
			
			if($scope.isStringNotEmpty($scope.config.updateLevelLetter)){
				
				let contact = student[$scope.config.absentContact];
				let message = $scope.config.updateLevelLetter;
				
				if($scope.isStringNotEmpty(contact)){
					
					message = message.replace(new RegExp('"اسم الطالب"', "g"), student.name);
					message = message.replace(new RegExp('"التاريخ"', "g"), moment().format("DD-MM-YYYY"));
					message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
					message = message.replace(new RegExp('"المستوى السابق"', "g"), $scope.levels[student.level].name);
					message = message.replace(new RegExp('"المستوى الجديد"', "g"), $scope.levels[student.level].name);
					
					let whatsapp = new Object();
					whatsapp.id = moment().valueOf();
					whatsapp.type = "تحديث المستوى";
					whatsapp.send = false;
					whatsapp.time = moment().format("DD-MM-YYYY HH:mm:ss");
					whatsapp.mobile = contact;
					whatsapp.content = message;
					
					$scope.set("whatsapp/" + whatsapp.id, whatsapp);

					if($scope.isStringNotEmpty($scope.config.textMeBot)){

						$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
					}
				}
			}
		});
	}
});