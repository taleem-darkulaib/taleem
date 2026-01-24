application.controllerProvider.register("view-teachers-attend", ($scope, $timeout) => {
	
	$scope.teachers = new Array();
	$scope.attendance = new Object();
	$scope.teacher = new Object();
	$scope.teachersAttend = new Object();
	
	$scope.get("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArray("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getBySemester("teachers-attend", teachersAttend =>{
		
		$scope.teachersAttend = teachersAttend;
		
		$scope.attendance = $scope.calculateMemberAttendance(teachersAttend);
	});
	
	$scope.selectTeacher = teacher => {
		$scope.teacher = teacher;
	}
	
	$scope.exportToExcel = () =>{
		
		let rows = new Array();
		
		rows.push(["#", "اسم المشرف", "حاضر", "غائب", "معتذر", "متأخر", "المجموع", "النسبة"]);
		
		$scope.teachers.forEach((teacher, index) => {
			
			if($scope.attendance[teacher.id] != null){
				
				rows.push([index + 1, 
					teacher.name,
					$scope.attendance[teacher.id]["حاضر"],
					$scope.attendance[teacher.id]["غائب"],
					$scope.attendance[teacher.id]["معتذر"],
					$scope.attendance[teacher.id]["متأخر"],
					$scope.attendance[teacher.id]["المجموع"],
					$scope.attendance[teacher.id]["النسبة"]
				]);
			
			}else{
				
				rows.push([index + 1, 
					teacher.name,
					0,
					0,
					0,
					0,
					0,
					0
				]);
			}
		});
		
		$scope.writeExcel(rows, "حضور المعلمين");
	}
});