application.controllerProvider.register("programs-students", ($scope, $timeout, $sce) => {
	
	$scope.students = new Object();
	$scope.payments = new Object();
	$scope.attendance = new Object();
	$scope.programs = new Object();
	$scope.program = new Object();
	$scope.program.id = localStorage.getItem("program") != null ? Number(localStorage.getItem("program")) : 0;
	$scope.search = new Object();
	$scope.studentsSearch = new Array();
	$scope.contacts = null;
	$scope.student = new Object();
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
	
	$scope.getArray("programs", programs => {
		$scope.programs = programs;
		if($scope.programs.length == 1){
			$scope.program = $scope.programs[0];
		}
		$scope.updateProgram();
	});

	$scope.searchStudents = ()=>{
		
		$scope.studentsSearch = $scope.values($scope.students).filter(student => {
			
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
				
				Object.entries($scope.attendance[student.cpr]).forEach(([date, attend]) => {
					
					if(attend.status != "غائب"){
						student.attendCount++;
					}
					
					student.totalDays++;
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
			contacts += student.mobile + ";" + $scope.program.name + " " + student.name;
		});
		
		$scope.contacts = $sce.trustAsResourceUrl("data:text/plain;charset=utf-8," + encodeURIComponent(contacts));
		
		$scope.searchStudents();
	}
	
	$scope.updateProgram = () => {
		
		if($scope.program != null && $scope.program.id != null){
			
			$scope.program = $scope.programs.find(program => program.id == $scope.program.id);
			
			if($scope.program != null && $scope.program.id != null){
				
				localStorage.setItem("program", $scope.program.id);
				
				$scope.get("programs-students/" + $scope.program.id, students => {
					
					$scope.students = students;
					
					$scope.updateStudents();
				});
				
				$scope.get("programs-payments/" + $scope.program.id, payments => {
					
					$scope.payments = payments;
					
					$scope.updateStudents();
				});
				
				$scope.get("programs-attend/" + $scope.program.id, attendance => {
					
					$scope.attendance = attendance;
					
					$scope.updateStudents();
				});
			}
		}
	}
	
	$scope.saveStudents = () =>{
		$scope.writeTableToExcel("students", "الطلبة");
	}
	
	$scope.selectStudent = student =>{
		$scope.student = student;
	}
	
	$scope.deleteStudent = () =>{
		
		$scope.removeReset("programs-students/" + $scope.program.id + "/" + $scope.student.cpr, ()=> {
			
			delete $scope.students[$scope.student.cpr];
			
			$scope.success("تم حذف الطالب بنجاح");
			
			$scope.updateStudents();
		});
	}
});