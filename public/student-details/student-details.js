application.controllerProvider.register("student-details", ($scope, $timeout, $http) => {

	$scope.levels = new Object();
	$scope.rooms = new Object();
	$scope.courses = new Object();
	$scope.levelCourses = new Array();
	$scope.units = new Object();
	$scope.teachers = new Object();
	
	$scope.generalComments = new Array();
	$scope.groups = new Object();
	$scope.evaluations = new Object();
	$scope.trips = new Array();
	$scope.marksDistribution = new Object();
	$scope.programs = new Object();
	$scope.exams = new Object();
	$scope.examsSubjects = new Object();
	
	$scope.name = null;
	$scope.student = null;
	$scope.comment = new Object();
	$scope.selectedCourse = null;
	
	function match(array){
		return (search, callback) => callback(array.filter(item => item.name != null && item.name.trim().toLowerCase().replace(/أ/g, "ا").replace(/ي/g, "ى").replace(/ة/g, "ه").includes(search.trim().toLowerCase().replace(/أ/g, "ا").replace(/ي/g, "ى").replace(/ة/g, "ه"))));
	}
	
	$scope.getActive("grades", grades => {
		if($scope.isListNotEmpty(grades)){
			$scope.grades = grades;
		}
	});
	
	$scope.getActive("nights", nights => {
		if($scope.isListNotEmpty(nights)){
			$scope.nights = nights;
		}
	});
	
	$scope.getActiveBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("rooms", rooms => {
		$scope.rooms = rooms;
	});
	
	$scope.get("courses", courses => {
		$scope.courses = courses;
	});
	
	$scope.get("units", units => {
		$scope.units = units;
	});
	
	$scope.getActive("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.getActiveArrayBySemester("general-comments", generalComments => {
		$scope.generalComments = generalComments;
	});
	
	$scope.getBySemester("groups", groups => {
		$scope.groups = groups;
	});
	
	$scope.getBySemester("evaluations", evaluations => {
		$scope.evaluations = evaluations;
	});
	
	$scope.getArrayBySemester("trips", trips => {
		$scope.trips = trips.filter(trip => trip.available);
	});
	
	$scope.getArrayBySemester("marks-distribution", marksDistribution => {
		$scope.marksDistribution = marksDistribution;
	});

	$scope.get("programs", programs => {
		$scope.programs = programs;
	});
	
	$scope.getBySemester("exams", exams => {
		$scope.exams = exams;
	});
	
	$scope.getBySemester("exams-subjects", examsSubjects => {
		$scope.examsSubjects = examsSubjects;
	});

	$scope.getArrayBySemester("students", students => {
		
		$("#name").typeahead({highlight: true}, {display: "name", source: match(students)});
		
		$(".twitter-typeahead").children().first().remove();
		
		$("#name").focus();
		
		$("#name").bind("typeahead:selected", (event, student) => {
			
			$("#name").blur();
			
			$scope.student = student;
			
			$scope.updateStudent();
		});
		
		if(localStorage.getItem("cpr") != null){
			
			$scope.student = students.find(student => student.cpr == localStorage.getItem("cpr"));
			
			$scope.name = $scope.student.name;
			
			$scope.updateStudent();
		}
	});
	
	$scope.updateStudent = () => {
		
		localStorage.setItem("cpr", $scope.student.cpr);
		
		$scope.getBySemester("payments/" + $scope.student.cpr, payment => {
			$scope.student.payment = payment;
		});
		
		$scope.getBySemester("books/" + $scope.student.cpr, books => {
			$scope.student.books = books;
		});
		
		$scope.getBySemester("comments/" + $scope.student.cpr, comments => {
			$scope.student.comments = comments;
		});
		
		$scope.getBySemester("students-attend/" + $scope.student.cpr, attendance => {
			$scope.student.attendance = attendance;
			$scope.student.sortedAttendance = $scope.getSortedAttendance(attendance);
			$scope.student.coursesAttendance = $scope.calculateStudentAttendance(attendance);
		});

		$scope.getBySemester("students-evaluations/" + $scope.student.cpr, evaluations => {
			$scope.student.evaluations = evaluations;
		});
		
		$scope.getArray("quran-evaluations/" + $scope.student.cpr, quranEvaluations => {
			$scope.student.quranEvaluations = quranEvaluations;
		});
		
		$scope.getBySemester("trips-students-payments/" + $scope.student.cpr, tripsPayments => {
			$scope.student.tripsPayments = tripsPayments;
		});
		
		$scope.getBySemester("students-marks/" + $scope.student.cpr, marks => {
			$scope.student.marks = marks;
		});
		
		$scope.getKeys("students-programs/" + $scope.student.cpr, programs => {
			$scope.student.programs = programs;
		});
		
		$scope.get("programs-students-payments/" + $scope.student.cpr, payments => {
			$scope.student.programsPayments = payments;
		});

		$scope.getBySemester("plan/" + $scope.student.level, plan => {
			$scope.student.plan = plan;
		});
		
		$scope.getArrayBySemester("levels-courses/" + $scope.student.level, levelCourses => {
						
			$scope.student.levelCourses = levelCourses;
			
			$scope.student.coursesCompletedTopics = new Object();
			
			$scope.student.levelCourses.forEach(course => {
				
				$scope.getBySemester("topics-completed/" + $scope.student.level + "/" + course, topicsCompleted => {
					
					$scope.student.coursesCompletedTopics[course] = topicsCompleted;
				});
			});
		});
		
		$scope.getValueBySemester("levels-rooms/" + $scope.student.level, room => {
			$scope.student.room = room;
		});
		
		$scope.getBySemester("levels-comments/" + $scope.student.level, levelComments => {
			$scope.student.levelComments = levelComments;
		});
				
		$scope.getBySemester("courses-comments/" + $scope.student.level, coursesComments => {
			$scope.student.coursesComments = coursesComments;
		});
		
		$scope.get("semesters", semesters =>{
						
			let currentSemester = semesters[$rootScope.currentSemester];
			
			if(currentSemester.dependent != null){
				
				$scope.dependentSemester = semesters[currentSemester.dependent];
				
				$scope.get("semester-info/" + currentSemester.dependent + "/students-marks/" + $scope.student.cpr, marks => {
					$scope.student.lastMarks = marks;
				});
				
				$scope.get("semester-info/" + currentSemester.dependent + "/marks-distribution", marksDistribution => {
					$scope.lastMarksDistribution = marksDistribution;
				});
			}
		});
	};

	$scope.clearSearch = () => {
		
		$scope.name = null;
		$scope.student = null;
		
		$("#name").val("");
		
		$timeout(() => {
			
			validateElement($("#name"));
			
			$("#name").focus();
		});
	}
	
	$("#commentModal").on("shown.bs.modal", () =>{
		
		$scope.info("يرجى ادخال معلومات الملاحظة");
		
		$("#applicant").focus();
		
		$scope.comment = new Object();
		$scope.comment.applicant = localStorage.getItem("applicant");
		
		isValidForm();
	});
	
	$scope.saveComment = ()=> {
		
		localStorage.setItem("applicant", $scope.comment.applicant);
		
		$scope.comment.id = moment().valueOf();
		$scope.comment.cpr = $scope.student.cpr;
		$scope.comment.level = $scope.student.level;
		$scope.comment.time = moment().format("DD-MM-YYYY HH:mm:ss");

		if($scope.student.comments == null){
			$scope.student.comments = new Object();
		}
		
		if($scope.isStringNotEmpty($scope.config.commentLetter)){
			
			let contact = $scope.student[$scope.config.absentContact];
			let message = $scope.config.commentLetter;
			
			message = message.replace(new RegExp('"اسم الطالب"', "g"), $scope.student.name);
			message = message.replace(new RegExp('"نوع الملاحظة"', "g"), $scope.comment.type);
			message = message.replace(new RegExp('"محتوى الملاحظة"', "g"), $scope.comment.content);
			message = message.replace(new RegExp('"التاريخ"', "g"), moment().format("DD-MM-YYYY"));
			message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
			message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), $scope.levels[$scope.student.level].name);
			
			let whatsapp = new Object();
			whatsapp.id = moment().valueOf();
			whatsapp.type = "الملاحظات";
			whatsapp.send = false;
			whatsapp.time = moment().format("DD-MM-YYYY HH:mm:ss");
			whatsapp.mobile = contact;
			whatsapp.content = message;
			
			$scope.setSilent("whatsapp/" + whatsapp.id, whatsapp);
			
			if($scope.isStringNotEmpty($scope.config.textMeBot)
				&& $scope.isStringNotEmpty(contact)){

				$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
			}
		}

		$scope.saveResetBySemester("comments/" + $scope.student.cpr + "/" + $scope.comment.id, $scope.comment, () => {
			
			$scope.success("تم حفظ الملاحظة بنجاح");
			
			$scope.student.comments[$scope.comment.id] = $scope.comment;
			
			$("#commentModal").modal("hide");
		});
	}
	
	$scope.selectCourse = course => {
		$scope.selectedCourse = course;
	}
	
	$scope.saveCourseAttend = ()=>{
		
		let attendance = $scope.student.attendance[$scope.selectedCourse];
		let course = $scope.courses[$scope.selectedCourse];
		
		console.log($scope.selectedCourse, course);
		
		$scope.setResetBySemester("students-attend/" + $scope.student.cpr + "/" + $scope.selectedCourse, attendance, ()=> {
			
			Object.entries(attendance).forEach(([date, attend]) => {
				
				$scope.setSilentBySemester("night-attend/" + $scope.student.level + "/" + $scope.selectedCourse + "/" + date + "/" + $scope.student.cpr, attend);
			});
			
			$scope.success("تم تعديل حضور مادة " + course.name + " بنجاح");
			
			$scope.selectedCourse = null;
			
			$scope.student.sortedAttendance = $scope.getSortedAttendance($scope.student.attendance);
		});
	}
	
	$scope.onPhotoSelected = ()=>{

		$scope.upload("photos/" + $scope.student.cpr + ".jpg", "photo", url => {
			
			$scope.student.photo = url;
			
			$scope.saveBySemester("students/" + $scope.student.cpr + "/photo", url, "تم حفظ رفع الصورة الشخصية");
		});
	}
	
	$scope.previewImage = url => {
		$scope.image = url;
		$("#preview").toast("show");
	}
});