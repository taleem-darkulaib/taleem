application.controllerProvider.register("outstandings", ($scope, $timeout) => {
	
	$scope.search = {grade:null, level:null, percentage:95};
	$scope.levels = new Array();
	$scope.courses = new Array();
	$scope.students = new Array();
	$scope.levelsCourses = new Object();
	$scope.marks = new Object();
	$scope.outstandings = new Array();
	$scope.percentages = new Array();
	
	for(let i=100; i>=0; i--){
		$scope.percentages.push(i);
	}
	
	$scope.getActive("grades", grades => {
		$scope.grades = grades;
	});
	
	$scope.searchOutstandings = ()=> {
		
		$scope.outstandings = $scope.students.filter(student => {
			
			return ($scope.isStringEmpty($scope.search.grade) || $scope.search.grade == student.grade)
					&& ($scope.isStringEmpty($scope.search.level) || $scope.search.level == student.level)
					&& ($scope.isStringEmpty($scope.search.percentage) || $scope.search.percentage <= student.percentage);
		});
	}
	
	$scope.getActiveArrayBySemester("levels", levels => {
		$scope.levels = levels;
		$scope.updateLevels();
	});
	
	$scope.getActiveArray("courses", courses => {
		$scope.courses = courses;
		$scope.updateLevels();
	});
	
	$scope.getBySemester("levels-courses", levelsCourses => {
		$scope.levelsCourses = levelsCourses;
		$scope.updateLevels();
	});
	
	$scope.getArrayBySemester("students", students => {
		$scope.students = students;
		$scope.updateLevels();
	});
	
	$scope.getBySemester("marks", marks =>{
		$scope.marks = marks;
		$scope.updateLevelsMarks();
	});
	
	$scope.updateLevels = ()=>{
		
		$scope.levels.forEach(level => {

			level.courses = $scope.courses.filter(course => $scope.levelsCourses[level.id] != null
																&& $scope.levelsCourses[level.id].includes(course.id));
																
			level.students = $scope.students.filter(student => student.level == level.id);
		});
		
		$scope.updateLevelsMarks();
	}
	
	$scope.updateLevelsMarks = ()=>{
		
		$scope.levels.forEach(level => {
			
			if(level.students != null){
				
				level.students.forEach(student => {
					
					student.cpr = student.cpr.toString();
					
					student.levelName = level.name;
					student.courses = new Object();
					
					let sum = 0;
					
					if(level.courses != null){
						
						level.courses.forEach(course => {
							
							if($scope.marks != null 
								&& $scope.marks[level.id] != null
								&& $scope.marks[level.id][course.id] != null
								&& $scope.marks[level.id][course.id][student.cpr] != null
								&& $scope.marks[level.id][course.id][student.cpr]['المجموع'] != null
								&& !isNaN($scope.marks[level.id][course.id][student.cpr]['المجموع'])){

								student.courses[course.id] = Number($scope.marks[level.id][course.id][student.cpr]['المجموع']);
								
								sum += student.courses[course.id];
							}
						});
					}
					
					student.percentage = level.courses.length != 0 ? Math.ceil(sum/level.courses.length) : 0;
				});
			}
		});
		
		$scope.searchOutstandings();
	}
	
	$scope.exportToExcel = () =>{
		
		let sheets = $scope.levels.map(level => {
			
			let sheet = new Object();
			sheet.name = level.name;
			sheet.rows = new Array();
			
			let header = new Array();
			
			header = ["#", "الرقم الشخصي", "اسم الطالب"];
			
			level.courses.forEach(course => {
				
				header.push(course.name);
			});
			
			header.push("المعدل");
			
			sheet.rows.push(header);
			
			level.students.forEach((student, index) => {
				
				let row = [index + 1, student.cpr, student.name];
				
				level.courses.forEach(course => {
				
					row.push(student.courses[course.id]);
				});
			
				sheet.rows.push(row);
				
				row.push(student.percentage);
			});
			
			return sheet;
		});

		$scope.writeExcelSheets(sheets, "درجات الطلبة");
	}
});