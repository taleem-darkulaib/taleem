application.controllerProvider.register("students", ($scope, $timeout, $sce) => {
	
	$scope.grades = new Object();
	$scope.levels = new Object();
	$scope.level = new Object();
	$scope.students = new Array();
	$scope.payments = new Object();
	$scope.attendance = new Object();
	$scope.studentsSearch = new Array();
	$scope.student = new Object();
	$scope.draft = new Array();
	$scope.search = new Object();
	$scope.preview = null;
	$scope.contacts = null;
	
	$scope.paymentClasses = {
		"لم يدفع" : "table-danger",
		"قيد المراجعة" : "table-warning",
		"تمت المراجعة" : "table-success",
	};
	
	$scope.attendClasses = {
		"لم يحضر" : "table-danger",
		"حضر قليلا" : "table-warning",
		"حضر كثيرا" : "table-info",
		"حضر دائما" : "table-success",
	};
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getActiveBySemester("levels", levels => {
		
		$scope.levels = levels;
		
		$scope.updateStudents();
	});
	
	$scope.onUpdateArrayBySemester("students", students =>{

		$scope.students = students;
		
		$scope.updateStudents();
	});
	
	$scope.getBySemester("payments", payments => {
		
		$scope.payments = payments;
		
		$scope.updateStudents();
	});
	
	$scope.getBySemester("students-attend", attendance => {
		
		$scope.attendance = attendance;
		
		$scope.updateStudents();
	});
	
	$scope.searchStudents = ()=>{
		
		$scope.studentsSearch = $scope.students.filter(student => {
			
			["cpr", "name", "mobile"].forEach(property => {
				if(student[property] == null){
					student[property] = "";
				}
			});
			
			return ($scope.isStringEmpty($scope.search.cpr) || student.cpr.toString().trim().includes($scope.search.cpr.trim()))
						&& ($scope.isStringEmpty($scope.search.name) || student.name.trim().includes($scope.search.name.trim()))
						&& ($scope.isStringEmpty($scope.search.mobile) || student.mobile.toString().trim().includes($scope.search.mobile.trim()))
						&& ($scope.isStringEmpty($scope.search.grade) || student.grade == $scope.search.grade)
						&& ($scope.isStringEmpty($scope.search.level) || student.level == $scope.search.level)
						&& ($scope.isStringEmpty($scope.search.payment) || student.payment == $scope.search.payment)
						&& ($scope.isStringEmpty($scope.search.attend) || student.attend == $scope.search.attend);
		});
	}
	
	$scope.updateStudents = () => {
		
		let contacts = "Phone;Name";
		
		$scope.values($scope.students).forEach(student => {
							
			student.attendCount = 0;
			student.totalDays = 0;

			if($scope.attendance == null || $scope.attendance[student.cpr] == null){
				student.attend = "لم يحضر";
			}else if($scope.attendance[student.cpr] != null){
				
				Object.entries($scope.attendance[student.cpr]).forEach(([course, dates]) => {
					
					Object.entries(dates).forEach(([date, attend]) => {
						
						if(attend.status != "غائب"){
							student.attendCount++;
						}
						
						student.totalDays++;
					});
				});
				
				student.attendPercent = Math.ceil(student.attendCount/student.totalDays * 100.0);
				
				if(student.attendPercent == 0){
					student.attend = "لم يحضر";
				}else if(student.attendPercent > 0 && student.attendPercent < 50){
					student.attend = "حضر قليلا";
				}else if(student.attendPercent >= 50 && student.attendPercent < 100){
					student.attend = "حضر كثيرا";
				}else if(student.attendPercent == 100){
					student.attend = "حضر دائما";
				}
			}
			
			if($scope.payments == null || $scope.payments[student.cpr] == null){
				student.payment = "لم يدفع";
			}else if(!$scope.payments[student.cpr].selected){
				student.payment = "قيد المراجعة";
			}else if($scope.payments[student.cpr].selected){
				student.payment = "تمت المراجعة";
			}
			
			contacts += "\r\n";
			contacts +=  student.mobile + ";" + (student.level != null && $scope.isListNotEmpty($scope.levels) && $scope.levels[student.level] != null ? $scope.levels[student.level].name + " " : "") + student.name;
		});
		
		$scope.values($scope.levels).forEach(level => level.students = $scope.values($scope.students).filter(student => student.level == level.id));
		
		$scope.contacts = $sce.trustAsResourceUrl("data:text/plain;charset=utf-8," + encodeURIComponent(contacts));
		
		$scope.searchStudents();
	}
	
	$scope.onUpdateArrayBySemester("draft", draft => {
		$scope.draft = draft;
	});
	
	$scope.previewImage = url => {
							
		$scope.preview = url;
		
		$("#preview").toast("show");
	}
	
	$scope.selectLevel = level => {
		$scope.level = level;
	}
	
	$scope.saveStudents = () =>{
		
		$scope.writeTableToExcel("students", "الطلبة");
	}
	
	$scope.saveLevelsStudents = () =>{
		
		let sheets = $scope.values($scope.levels).map(level => {
			
			let sheet = new Object();
			sheet.name = level.name;
			sheet.rows = new Array();
			sheet.rows.push(["#", "الرقم الشخصي", "اسم الطالب", "الصف"]);
			
			level.students.forEach((student, index) => {
				
				sheet.rows.push([index + 1, student.cpr, student.name, $scope.grades[student.grade].name]);
			});
			
			return sheet;
		});
		
		$scope.writeExcelSheets(sheets, "طلبة " + $scope.labels.levels);
	}
	
	$scope.selectStudent = student =>{
		$scope.student = student;
	}
	
	$scope.deleteStudent = () =>{
		
		if($scope.isStringNotEmpty($scope.student.cpr)){
			
			$scope.student.cpr = $scope.student.cpr.toString();
			
			$scope.removeBySemester("registration/" + $scope.student.grade + "/" + $scope.student.level + "/" + $scope.student.cpr, ()=> {
				
				$scope.removeBySemester("students/" + $scope.student.cpr, ()=> {
					
					$scope.removeBySemester("payments/" + $scope.student.cpr, ()=> {
						
						$scope.removeBySemester("books/" + $scope.student.cpr, "تم حذف الطالب بنجاح");
					});
				});
			});
		}
	}
	
	$scope.deleteDraft = () =>{
		
		if($scope.isStringNotEmpty($scope.student.cpr)){
			
			$scope.student.cpr = $scope.student.cpr.toString();
		
			$scope.removeBySemester("draft/" + $scope.student.cpr, "تم حذف الطالب بنجاح");
		}
	}
	
	$scope.archive = new Object();
	$scope.semesters = new Array();
	$scope.sourceSemester = null;
	
	$scope.getArray("semesters", semesters =>{
		$scope.semesters = semesters.filter(semester => semester.id != $scope.currentSemester);
	});
	
	$scope.copyFromSemester = ()=> {
		
		$scope.get("semester-info/" + $scope.sourceSemester + "/students", archive => {

			$scope.archive = archive;
		});
	}
	
	$scope.saveFromArchive = ()=> {
		
		$scope.saveBySemester("students", $scope.archive, "تم حفظ الطلبة بنجاح");
	}
});