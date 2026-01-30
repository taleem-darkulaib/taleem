application.controllerProvider.register("exams", ($scope, $timeout) => {
	
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.levelsCourses = new Object();
	$scope.exams = new Object();
	$scope.exam = new Object();
	$scope.dates = new Array();
	
	$scope.getActive("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveArrayBySemester("levels", levels => {

		$scope.levels = levels;
		
		$scope.updateLevelsCourses();
	});
	
	$scope.getActiveArray("courses", courses => {
			
		$scope.courses = courses;
		
		$scope.updateLevelsCourses();
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {

		$scope.levelsCourses = levelsCourses;
		
		$scope.updateLevelsCourses();
	});
	
	$scope.updateLevelsCourses = () => {
		
		$scope.levels.forEach(level => {
			level.courses = $scope.courses.filter(course => $scope.levelsCourses[level.id] != null && $scope.levelsCourses[level.id].includes(course.id));
		});
	}
	
	$scope.getBySemester("exams", exams => {
		$scope.exams = exams;
	});

	$scope.toAddExam = () => {

		$scope.info("يرجى ادخال معلومات الامتحان");
		
		$scope.exam = new Object();
		
		$scope.exam.id = moment().valueOf();
		$scope.exam.comments = new Array();
		
		$scope.addComment();
		
		$timeout(()=>{
			flatpickr("#startDate", {dateFormat: "d-m-Y", disableMobile: true});
			flatpickr("#endDate", {dateFormat: "d-m-Y", disableMobile: true});
			isValidForm();
		});
	}
	
	$scope.toEditExam = exam => {
		
		$scope.info("يمكنك تحديث معلومات الامتحان");
		
		$scope.exam = $scope.copy(exam);
		
		if($scope.exam.comments == null){
			$scope.exam.comments = new Array();
			$scope.addComment();
		}
		
		$scope.updatePeriod();
		
		$timeout(() => {
			flatpickr("#startDate", {dateFormat: "d-m-Y", disableMobile: true});
			flatpickr("#endDate", {dateFormat: "d-m-Y", disableMobile: true});
			isValidForm();
		});
	}
	
	$scope.addComment = () => {
		
		let comment = new Object();
		comment.id = moment().valueOf();
		comment.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.exam.comments.push(comment);
		
		$timeout(()=> $("input[name='comments']").last().focus());
	}
	
	$scope.deleteComment = index => {
		
		$scope.exam.comments.splice(index, 1);
	}
	
	$scope.updatePeriod = () => {
		
		$scope.dates = new Array();
		
		if($scope.exam.startDate != null
			&& $scope.exam.endDate != null){
			
			let startDate = moment($scope.exam.startDate, "DD-MM-YYYY");
			let endDate = moment($scope.exam.endDate, "DD-MM-YYYY");
			
			let currentDate = startDate.clone();
			
			while (currentDate.isSameOrBefore(endDate)) {
				
				$scope.dates.push(currentDate.format("DD-MM-YYYY"));
				currentDate.add(1, "days");
			}
		}
		
		$scope.exam.dates = $scope.dates.slice();
	}
	
	$scope.saveExam = () => {
		
		$scope.exam.comments.forEach(comment => delete comment["$$hashKey"]);
		$scope.exam.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		$scope.saveResetBySemester("exams/" + $scope.exam.id, $scope.exam, ()=> {
			
			$scope.success("تم حفظ الامتحان بنجاح");
			
			$scope.exams[$scope.exam.id] = $scope.exam;
			
			$("#examModal").modal("hide");
		});
	}
	
	$scope.selectExam = exam =>{
		$scope.exam = exam;
	}
	
	$scope.deleteExam = () =>{
		
		if($scope.isStringNotEmpty($scope.exam.id)){
			
			$scope.removeResetBySemester("exams/" + $scope.exam.id, ()=> {

				$scope.success("تم حذف الامتحان بنجاح");

				delete $scope.exams[$scope.exam.id];
			});
		}
	}
});