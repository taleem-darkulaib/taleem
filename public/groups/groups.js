application.controllerProvider.register("groups", ($scope, $timeout) => {
	
	$scope.semesters = new Array();
	$scope.sourceSemester = null;
	
	$scope.getArray("semesters", semesters =>{
		$scope.semesters = semesters.filter(semester => semester.id != $scope.currentSemester);
	});
	
	$scope.copyFromSemester = ()=> {
		
		$scope.get("semester-info/" + $scope.sourceSemester + "/groups", groups => {

			$scope.groups = groups;
		});
	}
	
	$scope.rooms = new Array();
	$scope.courses = new Object();
	$scope.teachers = new Array();
	$scope.levels = new Object();
	$scope.groups = new Object();
	$scope.group = new Object();
	$scope.partitions = new Array();
	$scope.students = new Array();
	
	$scope.getActiveBySemester("levels", levels => {
		
		$scope.levels = levels;
		
		let levelList = $scope.values(levels).sort((level1, level2) => level1.index - level2.index).map(level => level.id);
		
		$scope.getArrayBySemester("students", students => {
			$scope.students = students;
			$scope.students.sort((student1, student2) => levelList.indexOf(student1.level) - levelList.indexOf(student2.level) || student1.name.localeCompare(student2.name));
		});
	});
	
	$scope.getActiveArray("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getActiveArray("rooms", rooms => {
		$scope.rooms = rooms;
	});
	
	$scope.getActive("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.getBySemester("groups", groups => {
		$scope.groups = groups;
	});

	$scope.toAddGroup = ()=> {

		$scope.info("يرجى ادخال معلومات التقسيم");
		
		$scope.group = new Object();
		
		$scope.group.id = moment().valueOf();
		$scope.group.partitions = new Object();
		$scope.group.students = new Object();
		
		$scope.partitions = new Array();
		
		$scope.addPartition();
		
		$timeout(isValidForm);
	}
	
	$scope.toEditGroup = group => {
		
		$scope.info("يمكنك تحديث معلومات التقسيم");
		
		$scope.group = $scope.copy(group);
		
		if($scope.group.students == null){
			$scope.group.students = new Object();
		}
		
		if($scope.group.partitions == null){
			$scope.group.partitions = new Object();
			$scope.partitions = new Array();
			$scope.addPartition();
		}else{
			$scope.partitions = $scope.indexedArray($scope.group.partitions);
		}
		
		$scope.partitions.forEach((partition, index) => {
			
			if(partition.students == null){
				partition.students = new Array();
			}
		});

		$timeout(isValidForm);
	}
	
	$scope.addPartition = index => {
		
		let partition = new Object();
		
		partition.id = moment().valueOf();
		partition.index = $scope.length($scope.partitions);
		partition.time = moment().format("DD-MM-YYYY HH:mm:ss");
		partition.students = new Array();
		
		$scope.partitions.splice(index, 0, partition);
		
		$timeout(function(){
			$("input[name='partitions']").eq(index).focus();
		});
	}
	
	$scope.deletePartition = index => {
		
		$scope.partitions.splice(index, 1);
	}
	
	$scope.upPartition = index => {

		[$scope.partitions[index], $scope.partitions[index - 1]] = [$scope.partitions[index - 1], $scope.partitions[index]];
	}
	
	$scope.downPartition = index => {

		[$scope.partitions[index], $scope.partitions[index + 1]] = [$scope.partitions[index + 1], $scope.partitions[index]];
	}
	
	$scope.addToPartition = partition => {
		
		$scope.students.filter(student => student.selected).forEach(student => {
			
			student.cpr = student.cpr.toString();
			
			partition.students.push(student.cpr);
			
			if($scope.group.students[student.cpr] != null){

				let oldPartition = $scope.group.partitions[$scope.group.students[student.cpr]];
				
				oldPartition.students.splice(oldPartition.students.indexOf(student.cpr), 1);
			}
			
			$scope.group.students[student.cpr] = partition.id;
			student.selected = false;
		});		
	}
	
	$scope.removeFromPartition = partition => {
		
		$scope.students.filter(student => student.selected).forEach(student => {
			
			student.cpr = student.cpr.toString();
			
			if($scope.group.students[student.cpr] == partition.id){
				partition.students.splice(partition.students.indexOf(student.cpr), 1);
				delete $scope.group.students[student.cpr];
				student.selected = false;
			}
		});	
	}
	
	$scope.saveGroup = () => {
		
		$scope.partitions.forEach((partition, index) => {
			delete partition["$$hashKey"];
			partition.index = index;
		});
		
		$scope.group.partitions = Object.fromEntries($scope.partitions.map(partition => [partition.id, partition]));
		$scope.group.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.saveResetBySemester("groups/" + $scope.group.id, $scope.group, ()=>{
			
			$scope.success("تم حفظ التقسيم بنجاح");
			
			$scope.groups[$scope.group.id] = $scope.group;
			
			$("#groupModal").modal("hide");
		});
	}
	
	$scope.selectGroup = group =>{
		$scope.group = group;
	}
	
	$scope.deleteGroup = () =>{
		
		if($scope.isStringNotEmpty($scope.group.id)){
			
			$scope.removeResetBySemester("groups/" + $scope.group.id, ()=> {

				$scope.success("تم حذف التقسيم بنجاح");

				delete $scope.groups[$scope.group.id];
			});
		}
	}
});