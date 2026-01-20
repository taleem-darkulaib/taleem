application.controllerProvider.register("view-groups", ($scope, $timeout) => {
	
	$scope.levels = new Object();
	$scope.courses = new Object();
	$scope.teachers = new Object();
	$scope.groups = new Array();
	$scope.partitions = new Array();
	$scope.students = new Array();
	$scope.partitionStudents = new Array();
	$scope.group = localStorage.getItem("group") ? Number(localStorage.getItem("group")) : null;
	$scope.partition = localStorage.getItem("partition") ? Number(localStorage.getItem("partition")) : null;
	$scope.groupName = null;
	$scope.partitionName = null;
	$scope.course = null;
	
	$scope.getBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.get("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.getArrayBySemester("groups", groups => {

		$scope.groups = groups;
		
		$scope.updateGroup();
		
		$scope.updatePartition();
	});
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updatePartition();
	});
	
	$scope.updateGroup = () => {
		
		if($scope.group != null){
			
			localStorage.setItem("group", $scope.group);
			
			let group = $scope.groups.find(group => group.id == $scope.group);
			
			$scope.groupName = group.name;
			
			$scope.course = group.course;
			
			$scope.partitions = $scope.values(group.partitions);
		}
	}
	
	$scope.updatePartition = () => {
		
		if($scope.partition != null){
		
			localStorage.setItem("partition", $scope.partition);
			
			let partition = $scope.partitions.find(partition => partition.id == $scope.partition);
			
			if(partition != null){
				
				$scope.partitionName = partition.name;
			
				$scope.teacher = partition.teacher;
			
				$scope.partitionStudents = $scope.students.filter(student => partition.students != null && partition.students.includes(student.cpr));
			}
		}
	}
	
	$scope.exportToExcel = () =>{
		
		let group = $scope.groups.find(group => group.id == $scope.group);
		
		let sheets = $scope.partitions.map(partition => {
			
			let sheet = new Object();
			sheet.name = partition.name;
			sheet.rows = new Array();
			sheet.rows.push(["#", "الرقم الشخصي", "اسم الطالب", "المستوى"]);
			
			let students = $scope.students.filter(student => partition.students != null && partition.students.includes(student.cpr));
			
			students.forEach((student, index) => {
				
				sheet.rows.push([index + 1, student.cpr, student.name, $scope.levels[student.level].name]);
			});
			
			return sheet;
		});
		
		$scope.writeExcelSheets(sheets, "مجموعات تقسيم " + group.name);
	}
});