application.controllerProvider.register("group-quran", ($scope, $timeout) => {
	
	$scope.today = moment().format("DD-MM-YYYY");
	$scope.attendance = new Object();
	$scope.attend = false;
	$scope.groups = new Object();
	$scope.partitions = new Array();
	$scope.students = new Array();
	$scope.partitionStudents = new Array();
	$scope.group = localStorage.getItem("group") ? Number(localStorage.getItem("group")) : null;
	$scope.partition = localStorage.getItem("partition") ? Number(localStorage.getItem("partition")) : null;
	$scope.studentsQuran = new Object();
	$scope.evaluations = new Object();
	$scope.evaluation = new Object();
	$scope.quran = {
		"الفاتحة": 7,
		"البقرة": 286,
		"آل عمران": 200,
		"النساء": 176,
		"المائدة": 120,
		"الأنعام": 165,
		"الأعراف": 206,
		"الأنفال": 75,
		"التوبة": 129,
		"يونس": 109,
		"هود": 123,
		"يوسف": 111,
		"الرعد": 43,
		"إبراهيم": 52,
		"الحجر": 99,
		"النحل": 128,
		"الإسراء": 111,
		"الكهف": 110,
		"مريم": 98,
		"طه": 135,
		"الأنبياء": 112,
		"الحج": 78,
		"المؤمنون": 118,
		"النور": 64,
		"الفرقان": 77,
		"الشعراء": 227,
		"النمل": 93,
		"القصص": 88,
		"العنكبوت": 69,
		"الروم": 60,
		"لقمان": 34,
		"السجدة": 30,
		"سورة الأحزاب": 73,
		"سبأ": 54,
		"فاطر": 45,
		"يس": 83,
		"الصافات": 182,
		"ص": 88,
		"الزمر": 75,
		"غافر": 85,
		"فصلت": 54,
		"الشورى": 53,
		"الزخرف": 89,
		"الدخان": 59,
		"الجاثية": 37,
		"الأحقاف": 35,
		"محمد": 38,
		"الفتح": 29,
		"الحجرات": 18,
		"ق": 45,
		"الذاريات": 60,
		"الطور": 49,
		"النجم": 62,
		"القمر": 55,
		"الرحمن": 78,
		"الواقعة": 96,
		"الحديد": 29,
		"المجادلة": 22,
		"الحشر": 24,
		"الممتحنة": 13,
		"الصف": 14,
		"الجمعة": 11,
		"المنافقون": 11,
		"التغابن": 18,
		"الطلاق": 12,
		"التحريم": 12,
		"الملك": 30,
		"القلم": 52,
		"الحاقة": 52,
		"المعارج": 44,
		"نوح": 28,
		"الجن": 28,
		"المزمل": 20,
		"المدثر": 56,
		"القيامة": 40,
		"الإنسان": 31,
		"المرسلات": 50,
		"النبأ": 40,
		"النازعات": 46,
		"عبس": 42,
		"التكوير": 29,
		"الإنفطار": 19,
		"المطففين": 36,
		"الإنشقاق": 25,
		"البروج": 22,
		"الطارق": 17,
		"الأعلى": 19,
		"الغاشية": 26,
		"الفجر": 30,
		"البلد": 20,
		"الشمس": 15,
		"الليل": 21,
		"الضحى": 11,
		"الشرح": 8,
		"التين": 8,
		"العلق": 19,
		"القدر": 5,
		"البينة": 8,
		"الزلزلة": 8,
		"العاديات": 11,
		"القارعة": 11,
		"التكاثر": 8,
		"العصر": 3,
		"الهمزة": 9,
		"الفيل": 5,
		"قريش": 4,
		"الماعون": 7,
		"الكوثر": 3,
		"الكافرون": 6,
		"النصر": 3,
		"المسد": 5,
		"الإخلاص": 4,
		"الفلق": 5,
		"الناس": 6
	};
	
	$scope.getBySemester("groups", groups => {

		$scope.groups = groups;
		
		$scope.updateGroup();
		
		$scope.updatePartition();
	});
	
	$scope.get("students-quran", studentsQuran => {

		$scope.studentsQuran = studentsQuran;
	});
	
	$scope.getArrayBySemester("students", students => {

		$scope.students = students;
		
		$scope.updatePartition();
	});
	
	$scope.updateGroup = () => {
		
		if($scope.group != null){
			
			localStorage.setItem("group", $scope.group);
			
			let group = $scope.groups[$scope.group];
			
			$scope.partitions = $scope.values(group.partitions);
		}
	}
	
	$scope.updatePartition = () => {
		
		if($scope.partition != null){
		
			localStorage.setItem("partition", $scope.partition);
			
			let partition = $scope.partitions.find(partition => partition.id == $scope.partition);
			
			if(partition != null){
				
				$scope.partitionStudents = $scope.students.filter(student => partition.students != null && partition.students.includes(student.cpr));
				
				$(".collapse").collapse("hide");
				
				$timeout(()=>{
					
					$(".collapse").on("shown.bs.collapse", (event) =>{
						
						$scope.evaluation = new Object();
						
						$scope.evaluation.cpr = $(event.target).attr("cpr");
						
						$scope.evaluations = new Object();
						
						$scope.get("quran-evaluations/" + $scope.evaluation.cpr, evaluations => {

							$scope.evaluations = evaluations;
						});
					});
				});
				
				$scope.attendance = new Object();
				
				$scope.getBySemester("groups-attend/" + $scope.group + "/" + $scope.partition + "/" + $scope.today, function(attendance){
				
					$scope.attendance = attendance;
				});
			}
		}
	}
	
	$scope.saveEvaluation = () => {
		
		$scope.evaluation.time = moment().format("DD-MM-YYYY HH:mm:ss");
		
		if($scope.evaluation.id == null){
			
			$scope.evaluation.id = moment().valueOf();
			
			$scope.saveSection("student" + $scope.evaluation.cpr, "students-quran/" + $scope.evaluation.cpr, $scope.evaluation, ()=>{
				
				$scope.studentsQuran[$scope.evaluation.cpr] = $scope.evaluation;
			});
		}
		
		$scope.saveSection("student" + $scope.evaluation.cpr, "quran-evaluations/" + $scope.evaluation.cpr + "/" + $scope.evaluation.id, $scope.evaluation, ()=>{
				
			$scope.success("تم حفظ التقييم بنجاح");
			
			$scope.evaluations[$scope.evaluation.id] = $scope.evaluation;
			
			$(".collapse").collapse("hide");
			
			$scope.evaluation = new Object();
			
			$timeout(isValidForm);
		});
	}
	
	$scope.toEditEvaluation = evaluation => {
		
		$scope.evaluation = evaluation;
	}
	
	$scope.deleteEvaluation = evaluation => {
		
		$scope.remove("students-quran/" + evaluation.cpr, ()=>{

			$scope.remove("quran-evaluations/" + evaluation.cpr + "/" + $scope.evaluation.id, ()=>{
			});
		});
	}
	
	$scope.clickStudentAttend = (student, status) => {
		
		student.cpr = student.cpr.toString();
		
		if($scope.attendance[student.cpr] != null && status == $scope.attendance[student.cpr].status){
			
			$scope.attendance[student.cpr] = null;
			
			$scope.removeSilentBySemester("groups-attend/" + $scope.group + "/" + $scope.partition + "/" + $scope.today + "/" + student.cpr);
			$scope.removeSilentBySemester("night-attend/" + student.level + "/" + group.course + "/" + $scope.today + "/" + student.cpr);
			$scope.removeSilentBySemester("students-attend/" + student.cpr + "/" + group.course + "/" + $scope.today);
		}
	}
	
	$scope.updateStudentAttend = student => {
		
		student.cpr = student.cpr.toString();
		
		let group = $scope.groups[$scope.group];
		
		$scope.setSilentBySemester("group-attendance-monitor/" + $scope.today + "/" + $scope.group + "/" + $scope.partition + "/students", moment().format("DD-MM-YYYY HH:mm:ss"));
		$scope.setSilentBySemester("groups-attend/" + $scope.group + "/" + $scope.partition + "/" + $scope.today + "/" + student.cpr, $scope.attendance[student.cpr]);
		$scope.setSilentBySemester("night-attend/" + student.level + "/" + group.course + "/" + $scope.today + "/" + student.cpr, $scope.attendance[student.cpr]);
		$scope.setSilentBySemester("students-attend/" + student.cpr + "/" + group.course + "/" + $scope.today, $scope.attendance[student.cpr]);
	}
});