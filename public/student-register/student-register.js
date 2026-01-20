application.controllerProvider.register("student-register", ($scope, $timeout, $http, $location) => {

	$scope.levels = new Object();
	$scope.rooms = new Object();
	$scope.teachers = new Object();
	$scope.courses = new Object();
	$scope.plan = new Object();
	$scope.distributions = new Object();
	$scope.semester = new Object();
	
	$scope.level = new Object();
	$scope.student = new Object();
	$scope.student.cpr = localStorage.getItem("cpr");
	$scope.oldStudent = new Object();
	$scope.valid = false;
	$scope.registration = new Object();
	$scope.admin = sessionStorage.getItem("admin") == "true";
	$scope.image = null;
	$scope.levelComments = new Array();
	$scope.studentUrl = "https://" + window.location.host + "/register";
	
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
	
	$scope.getBySemester("levels", levels => {
		$scope.levels = levels;
	});
	
	$scope.get("rooms", rooms => {
		$scope.rooms = rooms;
	});
	
	$scope.get("teachers", teachers => {
		$scope.teachers = teachers;
	});
	
	$scope.get("courses", courses => {
		$scope.courses = courses;
	});

	$scope.getBySemester("plan", plan => {
		$scope.plan = plan;
	});
	
	$scope.getBySemester("distributions", distributions => {
		$scope.distributions = distributions;
	});
	
	$scope.get("semesters/" + $scope.currentSemester, semester => {
		$scope.semester = semester;
	});
	
	$scope.get("config", config => {

		$scope.config = config;
		
		if($scope.config.registration || $scope.admin){
			$scope.config.registration = true;
			$scope.info("يرجى ادخال الرقم الشخصي");
			$scope.updateCpr();
		}else{
			$scope.danger("انتهى التسجيل");
		}
		
		if($scope.config.registration){
			$timeout($scope.updateRegistration);
		}
	});
	
	$scope.updateCpr = () => {
		
		if($scope.isValidCpr($scope.student.cpr)){
			
			$scope.valid = true;
			
			localStorage.setItem("cpr", $scope.student.cpr);
			
			$("#cpr").blur();
			
			$scope.getBySemester("students/" + $scope.student.cpr, student =>{
				
				if($scope.isListNotEmpty(student)){

					$scope.student = student;
					
					$scope.oldStudent = $scope.copy($scope.student);
					
					$scope.updateGrade(false);
					
					if($scope.admin || $scope.config.allowEdit){
						
						$scope.info("يمكنك تحديث البيانات");
						
					}else{
						
						$scope.valid = false;
						
						$scope.danger("التسجيل موجود مسبقا");
					}
				
				}else{
					
					$scope.getBySemester("draft/" + $scope.student.cpr, student => {
						
						if($scope.isListNotEmpty(student)){
							
							$scope.info("يرجى اكمال التسجيل");
							
							$scope.student = student;
							
							$scope.oldStudent = $scope.copy($scope.student);
							
							$scope.updateGrade(false);
							
						}else{
							
							$scope.getBySemester("archive/" + $scope.student.cpr, student => {

								if($scope.isListNotEmpty(student)){
									
									$scope.info("يرجى التأكد من المعلومات واكمال التسجيل");
									
									$scope.student = student;
									$scope.student.level = null;
									
									$scope.oldStudent = $scope.copy($scope.student);
									
									$scope.updateGrade(false);
								
								}else{
									
									$scope.info("يرجى ادخال المعلومات المطلوبة");
									
									$("#name").focus();
								}
							});
						}
					});
				}
			});

		}else{
			
			$("#cpr").focus();
		}
	}
	
	$scope.updateGrade = reset => {
		
		if($scope.student.grade != null){
			
			if(reset){
				
				$scope.student.level = null;
			}
			
			$scope.onUpdateBySemester("registration/" + $scope.student.grade, registration => {

				$scope.registration = registration;
			});
		}
	}
	
	$scope.clearCpr = () => {
		
		$scope.info("يرجى ادخال الرقم الشخصي");

		$scope.loading = false;
		$scope.valid = false;
		$scope.submitted = false;

		localStorage.removeItem("cpr");
		
		$("#payment").val("");
		
		validateElement($("#payment"));
		
		$scope.student = new Object();

		$timeout(()=> {
			
			isValidForm();
			
			$("#cpr").focus();
		});
	}
	
	$scope.updateStudent = () => {
		
		if($scope.valid && $scope.isValidCpr($scope.student.cpr)){
			
			$scope.student.accessTime = moment().format("DD-MM-YYYY HH:mm:ss");

			$scope.setSilentBySemester("draft/" + $scope.student.cpr, $scope.student);
		}
	}
	
	$scope.updateRegistration = ()=> {
		
		flatpickr("#dateOfBirth", {dateFormat: "d-m-Y"});
		
		$(":input").not("#cpr").change(() => {
		
			$scope.updateStudent();
		});
		
		$("#payment").change(() => {
			
			$scope.student.payment = $scope.getImage("payment");
			
			$scope.$digest();
			
			$scope.upload($scope.student.cpr + ".jpg", "payment", url => {
				
				$scope.student.payment = url;
				
				$scope.updateStudent();
			});
		});
		
		$("#photo").change(() => {
			
			$scope.student.photo = $scope.getImage("photo");
			
			$scope.$digest();
			
			$scope.upload("photos/" + $scope.student.cpr + ".jpg", "photo", url => {
				
				$scope.student.photo = url;
				
				$scope.updateStudent();
			});
		});
	}
	
	$scope.copyBenefitNumber = () => {
		
		$scope.copyToClipboard($("#benefit").val());
	}
	
	$scope.previewImage = image => {
		
		$scope.image = image;
		
		$("#preview").toast("show");
	}
	
	$scope.updateLevel = () => {
		
		if($scope.student.level == null){
			
			if($scope.isListNotEmpty($scope.distributions[$scope.student.grade])){
				
				let levels = new Array();

				$scope.distributions[$scope.student.grade].forEach(level => {

					levels.push({id:level, count:$scope.length($scope.registration[level])});
				});
				
				levels.sort((level1, level2) => level1.count - level2.count);
				
				$scope.student.level = levels[0].id;
			}
		}
	}
	
	$scope.selectLevel = level => {
		$scope.level = level;
	}
	
	$scope.saveStudent = () => {
		
		let result = isValidForm();
		
		if(result == null && $scope.isValidCpr($scope.student.cpr)){
			
			$scope.submitted = true;
			$scope.loading = true;
			
			$scope.wait();
			
			$scope.updateLevel();
			
			$scope.student.id = moment().valueOf();
			$scope.student.cpr = $scope.student.cpr.toString();
			$scope.student.time = moment().format("DD-MM-YYYY HH:mm:ss");
			
			if($scope.oldStudent.grade != null
				&& $scope.oldStudent.level != null
				&& $scope.oldStudent.grade != $scope.student.grade
				&& $scope.isStringNotEmpty($scope.oldStudent.cpr)){

				$scope.removeBySemester("registration/" + $scope.oldStudent.grade + "/" + $scope.oldStudent.level + "/" + $scope.oldStudent.cpr);
			}
			
			$scope.removeBySemester("draft/" + $scope.student.cpr);
			
			if($scope.config.transfer){
				
				let payment = new Object();
				payment.id = moment().valueOf();
				payment.cpr = $scope.student.cpr;
				payment.time = moment().format("DD-MM-YYYY HH:mm:ss");
				payment.receiver = "بنفت";
				payment.amount = $scope.semester.fees;
				payment.selected = false;
				
				if($scope.student.payment != null){
					payment.url = $scope.student.payment;
				}
				
				if($scope.student.level != null){
					payment.level = $scope.student.level;
				}
				
				$scope.setSilentBySemester("payments/" + $scope.student.cpr, payment);
			}
			
			if($scope.isStringNotEmpty($scope.config.registerLetter)){

				let contact = $scope.student[$scope.config.absentContact];
				let message = $scope.config.registerLetter;
				
				message = message.replace(new RegExp('"اسم الطالب"', "g"), $scope.student.name);
				message = message.replace(new RegExp('"التاريخ"', "g"), moment().format("DD-MM-YYYY"));
				message = message.replace(new RegExp('"الوقت"', "g"), moment().format("HH:mm"));
				
				if($scope.student.level != null){
					message = message.replace(new RegExp('"' + $scope.labels.level + '"', "g"), $scope.levels[$scope.student.level].name);
				}
				
				let whatsapp = new Object();
				whatsapp.id = moment().valueOf();
				whatsapp.type = "التسجيل";
				whatsapp.send = false;
				whatsapp.time = moment().format("DD-MM-YYYY HH:mm:ss");
				whatsapp.mobile = contact;
				whatsapp.content = message;
				
				$scope.set("whatsapp/" + whatsapp.id, whatsapp);
				
				if($scope.isStringNotEmpty($scope.config.textMeBot)
					&& $scope.isStringNotEmpty(contact)){

					$http.get("https://api.textmebot.com/send.php?recipient=+973" + contact + "&apikey=" + $scope.config.textMeBot + "&text=" + encodeURIComponent(message));
				}
			}
			
			if($scope.student.level != null){
				
				$scope.getArrayBySemester("levels-comments/" + $scope.student.level, levelComments => {
					$scope.levelComments = levelComments;
				});
	
				$scope.setSilentBySemester("registration/" + $scope.student.grade + "/" + $scope.student.level + "/" + $scope.student.cpr, $scope.student.time);
				$scope.saveBySemester("students/" + $scope.student.cpr, $scope.student, "تم حفظ تسجيل الطالب بنجاح في المستوى " + $scope.levels[$scope.student.level].name);

			}else{

				$scope.saveBySemester("students/" + $scope.student.cpr, $scope.student, "تم حفظ تسجيل الطالب بنجاح");
			}
		
		}else{
			
			$scope.danger(result);
		}
	}
});