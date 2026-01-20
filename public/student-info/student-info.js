console.log("info application.controllerProvider");

application.controllerProvider.register("student-info", ($scope, $timeout) => {
	
	$scope.levels = new Object();
	$scope.rooms = new Object();
	$scope.courses = new Object();
	$scope.levelCourses = new Array();
	$scope.units = new Object();
	$scope.teachers = new Object();
	
	$scope.generalComments = new Array();
	$scope.groups = new Object();
	$scope.marksDistribution = new Object();
	$scope.evaluations = new Object();
	$scope.trips = new Object();
	$scope.programs = new Object();
	
	$scope.student = new Object();
	$scope.semester = new Object();
	
	$scope.cpr = localStorage.getItem("cpr");
	$scope.cprs = localStorage.getItem("cprs") != null ? JSON.parse(localStorage.getItem("cprs")) : new Array();
	$scope.image = null;
	$scope.studentUrl = "https://" + window.location.host;
	$scope.visitsUrl = "https://" + window.location.host + "/visits";
	
	$scope.get("semesters/" + $rootScope.currentSemester, semester => {
		$scope.semester = semester;
	});
	
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
	
	$scope.getActive("courses", courses => {
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
	
	$scope.getBySemester("trips", trips => {
		$scope.trips = trips;
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
	
	$scope.previewImage = url => {
		$scope.image = url;
		$("#preview").toast("show");
	}
	
	$scope.updateCpr = () => {

		if($scope.isValidCpr($scope.cpr)){
			
			$scope.getBySemester("students/" + $scope.cpr, student => {
				
				$scope.student = student;
				
				if($scope.isListNotEmpty($scope.student)){
					
					localStorage.setItem("cpr", $scope.cpr);
					
					if(!$scope.cprs.includes($scope.cpr)){
						$scope.cprs.push($scope.cpr);
					}
					
					localStorage.setItem("cprs", JSON.stringify($scope.cprs));
					
					let visit = new Object();
					visit.id = moment().valueOf();
					visit.cpr = $scope.cpr;
					visit.name = $scope.student.name;
					visit.level = $scope.student.level != undefined ? $scope.student.level : null;
					visit.time = moment().format("DD-MM-YYYY HH:mm:ss");

					$scope.setSilent("visits/" + visit.id, visit);
					
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
					
				}else {
					
					$scope.danger("الرقم الشخصي غير مسجل في التعليم الديني");
				}
				
				$("#cpr").select();
			});
		}
	}
	
	$scope.clearCpr = ()=> {
		
		localStorage.removeItem("cpr");
		
		$scope.cpr = null;
		$scope.student = null;
		
		$timeout(() => {
			
			validateElement($("#cpr"));
			
			$("#cpr").focus();
		});
	}
	
	if($scope.cpr != null){
		$scope.updateCpr();
	}else{
		$("#cpr").focus();
	}
	
	$scope.onFileSelect = ()=>{
		
		console.log("onFileSelect");
		
		$scope.upload($scope.student.cpr + ".jpg", "payment", url => {
			
			console.log("onFileSelect ", url);
			
			let payment = new Object();
			payment.id = moment().valueOf();
			payment.cpr = $scope.student.cpr;
			payment.time = moment().format("DD-MM-YYYY HH:mm:ss");
			payment.receiver = "بنفت";
			payment.amount = $scope.semester.fees;
			payment.selected = false;
			payment.level = $scope.student.level != undefined ? $scope.student.level : null;
			payment.url = url;
			
			$scope.student.payment = payment;
			
			$scope.setBySemester("students/" + $scope.student.cpr + "/payment", url, "تم حفظ صورة الدفع بنجاح");
			$scope.setBySemester("payments/" + $scope.student.cpr, payment, "تم حفظ صورة الدفع بنجاح");
		});
	}
	
	$scope.onPhotoSelected = ()=>{
		
		$scope.upload("photos/" + $scope.student.cpr + ".jpg", "photo", url => {
			
			$scope.student.photo = url;
			
			$scope.setBySemester("students/" + $scope.student.cpr + "/photo", url, "تم حفظ رفع الصورة الشخصية");
		});
	}
	
	onTripPayment = element => {
		
		let tripId = Number($(element).attr("tripId"));
		
		console.log("tripId > ", tripId);
		
		let trip = $scope.trips[tripId];
		
		console.log("trip > ", trip);
		
		$scope.upload("trips/" + trip.id + "/" + $scope.student.cpr + ".jpg", "tripsPayments-" + tripId, url => {
			
			let payment = new Object();
			
			payment.id = moment().valueOf();
			payment.time = moment().format("DD-MM-YYYY HH:mm:ss");
			payment.receiver = "بنفت";
			payment.amount = Number(trip.feesAmount);
			payment.cpr = $scope.student.cpr;
			payment.level = $scope.student.level != undefined ? $scope.student.level : null;
			payment.selected = false;
			payment.url = url;
			
			$scope.student.tripsPayments[trip.id] = payment;
			
			$scope.setBySemester("trips-payments/" + trip.id + "/" + $scope.student.cpr, payment, "تم حفظ صورة الدفع بنجاح");
			$scope.setBySemester("trips-students-payments/" + $scope.student.cpr + "/" + trip.id, payment, "تم حفظ صورة الدفع بنجاح");
		});
	}

	$scope.course = null;
	$scope.date = null;
	$scope.comment = null;
	
	$scope.addComment = (course, date) => {
		
		$scope.course = course;
		$scope.date = date;
		$scope.comment = null;

		$timeout(()=> validateElement($("#comment")));
	}
	
	$scope.saveComment = () => {
		
		if($scope.config.acceptReason){
			$scope.student.attendance[$scope.course][$scope.date].status = "معتذر";
		}
		
		$scope.student.attendance[$scope.course][$scope.date].comment = $scope.comment;
		
		$scope.student.sortedAttendance = $scope.getSortedAttendance($scope.student.attendance);
		
		$scope.saveBySemester("night-attend/" + $scope.student.level + "/" + $scope.course + "/" + $scope.date + "/" + $scope.student.cpr, $scope.student.attendance[$scope.course][$scope.date], "تم حفظ الملاحظة بنجاح");
		$scope.saveBySemester("students-attend/" + $scope.student.cpr + "/" + $scope.course + "/" + $scope.date, $scope.student.attendance[$scope.course][$scope.date], "تم حفظ الملاحظة بنجاح");
	}
});