const application = angular.module("application", ["checklist-model", "ngRoute", "ngSanitize"], $controllerProvider => {
	application.controllerProvider = $controllerProvider;
});

application.config($routeProvider => {
	application.routeProvider = $routeProvider;
});

application.run(function($rootScope, $timeout, $location, $route, $sce){
	
	window.$rootScope = $rootScope;
	
	$rootScope.admin = sessionStorage.getItem("admin") == "true";
	
	$rootScope.config = {title:"التعليم الديني", period:"الليلة"};
	
	$rootScope.title = "نظام التعليم الديني";
	
	$rootScope.alert = {class:"alert-warning", message:"يرجى الانتظار"};
	
	$rootScope.message = function(className, message, icon, title){
		window.scrollTo(0, 0);
		$rootScope.alert = {class:className, message:message, icon:icon, title:title};
	}
	
	$rootScope.none = function(){
		$rootScope.message("d-none", null);
	}
	
	$rootScope.info = function(message){
		$rootScope.message("alert-info", message, "bi-info-circle-fill", "معلومة مهمة:");
	}

	$rootScope.warning = function(message){
		$rootScope.message("alert-warning", message, "bi-exclamation-triangle-fill", "تنبيه!");
	}

	$rootScope.success = function(message){
		$rootScope.message("alert-success", message, "bi-check-circle-fill", "تم بنجاح!");
	}

	$rootScope.danger = function(message){
		$rootScope.message("alert-danger", message, "bi-x-circle-fill", "خطأ!");
	}
	
	$rootScope.wait = function(){
		$rootScope.warning("يرجى الانتظار");
	}
	
	$rootScope.toFunction = (selectedCategory, selectedFunction) =>{
		
		console.log("selectedFunction", selectedFunction);
		
		$rootScope.categoryTitle = selectedCategory.title;
		$rootScope.functionTitle = selectedFunction.title;
		
		localStorage.setItem("categoryTitle", $rootScope.categoryTitle);
		localStorage.setItem("functionTitle", $rootScope.functionTitle);
		
		$rootScope.title = selectedFunction.title;
		
		if(!Array.from(document.getElementsByTagName("script")).some(script => script.src.includes("scripts/" + selectedFunction.url + ".js"))){

			const script = document.createElement("script");
			script.src = "./" + selectedFunction.url + "/" + selectedFunction.url + ".js?time=" + moment().valueOf();
			document.head.appendChild(script);
			
			script.onload = () =>{
				
				console.log($location.path());
				
				$timeout(() => {
					$location.path("/" + selectedFunction.url);
					$location.search("time", moment().valueOf());
				});
			}
		
		}else{
			
			$timeout(() => {
				$location.path("/" + selectedFunction.url);
				$location.search("time", moment().valueOf());
			});
		}
				
		$("#menu").modal("hide");
	}
	
	$rootScope.uploaded = false;
	$rootScope.submitted = true;
	$rootScope.loading = true;
	$rootScope.grades = {
					"1": {id:1, name:"الروضة", active:true},
					"2": {id:2, name:"الأول الإبتدائي", active:true},
					"3": {id:3, name:"الثاني الإبتدائي", active:true},
					"4": {id:4, name:"الثالث الإبتدائي", active:true},
					"5": {id:5, name:"الرابع الإبتدائي", active:true},
					"6": {id:6, name:"الخامس الإبتدائي", active:true},
					"7": {id:7, name:"السادس الإبتدائي", active:true},
					"8": {id:8, name:"الأول الإعدادي", active:true},
					"9": {id:9, name:"الثاني الإعدادي", active:true},
					"10": {id:10, name:"الثالث الإعدادي", active:true},
					"11": {id:11, name:"الأول الثانوي", active:true},
					"12": {id:12, name:"الثاني الثانوي", active:true},
					"13": {id:13, name:"الثالث الثانوي", active:true},
					"14": {id:14, name:"الجامعة", active:true},
					"15": {id:15, name:"التخرج", active:true}
	};
	$rootScope.nights = {
					"1": {id:1, name:"ليلة الأحد", active:true},
					"2": {id:2, name:"ليلة الإثنين", active:true},
					"3": {id:3, name:"ليلة الثلاثاء", active:true},
					"4": {id:4, name:"ليلة الأربعاء", active:true},
					"5": {id:5, name:"ليلة الخميس", active:true},
					"6": {id:6, name:"ليلة الجمعة", active:true},
					"7": {id:7, name:"ليلة السبت", active:true}
	};
	$rootScope.times = new Array();
	$rootScope.days = new Array();
	$rootScope.percentages = new Array();
	$rootScope.attendTypes = {
		"حاضر":"attend",
		"غائب":"absent",
		"متأخر":"late",
		"معتذر":"notify"
	};
	
	$rootScope.labels = {
		"level": "المستوى",
		"mobile": "رقم الهاتف 1",
		"phone": "رقم الهاتف 2",
		"contact": "هاتف الطالب	"
	}
	
	$rootScope.getNight = date => {
		return $rootScope.nights != null ? $rootScope.nights[((moment(date, "DD-MM-YYYY").day() + 1) % 7) + 1].name : null;
	}
	
	firebase.database().ref("labels").once("value").then(function(snapshot){
		
		if(snapshot.val() != null){
			$rootScope.labels = snapshot.val();
		}
		
		$rootScope.$digest();
	});
	
	for(let i=0; i<24; i++){
		for(let j=0; j<60; j+=10){
			$rootScope.times.push(moment({hour:i, minute:j}).format("HH:mm"));
		}
	}
	
	for (let i=0; i<7; i++){
		$rootScope.days.push(moment().locale("ar").day(i).format("dddd"));
    }
	
	for (let i=0; i<=100; i+=5){
		$rootScope.percentages.push(i);
    }
	
	$rootScope.isStringEmpty = function(value){
		return value == null || value.toString().trim().length == 0;
	}
	
	$rootScope.isStringNotEmpty = function(value){
		return value != null && value.toString().trim().length != 0;
	}
	
	$rootScope.isListNotEmpty = function(object){
		return object != null ? Object.keys(object).length != 0 : false;
	}
	
	$rootScope.isListEmpty = function(object){
		return object != null ? Object.keys(object).length == 0 : true;
	}
	
	$rootScope.length = function(object){
		return object != null ? Object.keys(object).length : 0;
	}
	
	$rootScope.keys = function(object){
		return object != null ? Object.keys(object) : new Array();
	}
	
	$rootScope.values = function(object){
		return object != null ? Object.values(object) : new Array();
	}
	
	$rootScope.array = function(object){
		return object != null ? Object.values(object) : new Array();
	}
	
	$rootScope.numbers = function(number){
		
		$rootScope.list = new Array();
		
		for (let i=1; i<=number; i++){
			$rootScope.list.push(i);
		}
	
		return $rootScope.list;
	}
	
	$rootScope.active = function(list){
		
		return list != null ? Object.fromEntries(Object.entries(list).filter(([key, item]) => item.active)) : new Object();
	}
	
	$rootScope.activeArray = function(list){
		
		return list != null ? Object.values(list).filter(item => item.active) : new Array();
	}
	
	$rootScope.activeIndexedArray = function(list){
		
		return list != null ? Object.values(list).filter(item => item.active).sort((item1, item2) => item1.index - item2.index).map((item, index) => {
			
			item.index = index;
			
			return item;
		
		}) : new Array();
	}
	
	$rootScope.indexedArray = function(list){
		
		return list != null ? Object.values(list).sort((item1, item2) => item1.index - item2.index).map((item, index) => {
			
			item.index = index;
			
			return item;
		
		}) : new Array();
	}
	
	$rootScope.copy = function(object){
		
		return Object.assign(new Object(), object);
	}
	
	$rootScope.getImage = function(element){
		
		return URL.createObjectURL($("#" + element).get(0).files[0]);
	}

	$rootScope.isValidCpr = function(cpr){
		
		return isValidCpr(cpr);
	}
	
	$rootScope.copyToClipboard = function(value){
		
		var element = document.createElement("textarea");

		element.value = value;
		
		document.body.appendChild(element);
		
		element.select();
		
		document.execCommand("copy");
		
		document.body.removeChild(element);

		$("#copy").toast("show");
	}
	
	$rootScope.readExcel = function(input, callback){
		
		let file = $("#" + input).get(0).files[0];
		
		$rootScope.uploaded = true;
		
		let reader = new FileReader();
		
		$rootScope.wait();
		
		reader.onload = (event) => {
			
			const workbook = new ExcelJS.Workbook();
			
			workbook.xlsx.load(event.target.result).then(() => {
				
				const worksheet = workbook.getWorksheet(1);
				
				let rows = new Array();
				
				worksheet.eachRow({includeEmpty:true}, (worksheetRow, rowNumber) => {
					
					let row = new Array();
						
					worksheetRow.eachCell({includeEmpty:true}, (cell, cellNumber) => {
					
						row.push(cell.value);
					});
					
					rows.push(row);
				});
				
				if(callback != null){
					
					$rootScope.none();
					
					callback(rows);
					
					$rootScope.$digest();
				}
			});
		};
		
		reader.readAsArrayBuffer(file);
	}
	
	$rootScope.writeTableToExcel = function(table, fileName){
		
		let rows = $("#" + table).find("tr:not(.no-export)").map(function(){

			return [$(this).find("th:not(.no-export), td:not(.no-export)").map(function(){
				
				return $(this).text().trim();
				
			}).get()];
			
		}).get();
		
		console.log(rows);
		
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(fileName);
		
		worksheet.views = [{rightToLeft:true, zoomScale:150}];

		worksheet.addRows(rows);
		
		worksheet.getRow(1).font = {bold:true};
		
		worksheet.eachRow({includeEmpty:true}, row => {
			row.eachCell({includeEmpty:true}, cell => {
				cell.border = {top:{style:"thin"}, right:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}};
				cell.alignment = {vertical:"middle", horizontal:"right", wrapText:true};
			});
		});
		
		worksheet.columns.forEach(column => {
								
			column.width = undefined;
			
			let maxLength = 0;
			
			column.eachCell({includeEmpty:true}, cell => {
				
				const cellLength = cell.value != null ? cell.value.toString().length : 10;
				
				maxLength = Math.max(maxLength, cellLength);
			});
			
			column.width = maxLength + 2;
		});
		
		workbook.xlsx.writeBuffer().then(buffer => {

			$rootScope.href = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([buffer])));
			$rootScope.download = fileName + ".xlsx";
			
			console.log($rootScope.download);
			
			$rootScope.$digest();
			
			$("#download").get(0).click();
		});
	}
	
	$rootScope.href = null;
	$rootScope.download = null;
			
	$rootScope.writeExcel = function(rows, fileName){
		
		console.log(rows);
		
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, ""));
		
		worksheet.views = [{rightToLeft:true, zoomScale:150}];

		worksheet.addRows(rows);
		
		worksheet.getRow(1).font = {bold:true};
		
		worksheet.eachRow({includeEmpty:true}, row => {
			row.eachCell({includeEmpty:true}, cell => {
				cell.border = {top:{style:"thin"}, right:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}};
				cell.alignment = {vertical:"middle", horizontal:"right", wrapText:true};
			});
		});
		
		worksheet.columns.forEach(column => {
								
			column.width = undefined;
			
			let maxLength = 0;
			
			column.eachCell({includeEmpty:true}, cell => {
				
				const cellLength = cell.value != null ? cell.value.toString().length : 10;
				
				maxLength = Math.max(maxLength, cellLength);
			});
			
			column.width = maxLength + 2;
		});
		
		workbook.xlsx.writeBuffer().then(buffer => {

			$rootScope.href = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([buffer])));
			$rootScope.download = fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "") + ".xlsx";
			
			console.log($rootScope.download);
			
			$rootScope.$digest();
			
			$("#download").get(0).click();
		});
	}
	
	$rootScope.writeExcelSheets = function(sheets, fileName){
		
		const workbook = new ExcelJS.Workbook();
		
		sheets.forEach(sheet => {
			
			const worksheet = workbook.addWorksheet(sheet.name);

			worksheet.views = [{rightToLeft:true, zoomScale:150}];

			worksheet.addRows(sheet.rows);
			
			worksheet.getRow(1).font = {bold:true};
			
			worksheet.eachRow({includeEmpty:true}, row => {
				row.eachCell({includeEmpty:true}, cell => {
					cell.border = {top:{style:"thin"}, right:{style:"thin"}, left:{style:"thin"}, bottom:{style:"thin"}};
					cell.alignment = {vertical:"middle", horizontal:"right", wrapText:true};
				});
			});
			
			worksheet.columns.forEach(column => {
									
				column.width = undefined;
				
				let maxLength = 0;
				
				column.eachCell({includeEmpty:true}, cell => {
					
					const cellLength = cell.value != null ? cell.value.toString().length : 10;
					
					maxLength = Math.max(maxLength, cellLength);
				});
				
				column.width = maxLength + 2;
			});
		});
		
		workbook.xlsx.writeBuffer().then(buffer => {

			$rootScope.href = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([buffer])));
			$rootScope.download = fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "") + ".xlsx";
			
			console.log($rootScope.download);
			
			$rootScope.$digest();
			
			$("#download").get(0).click();
		});
	}
	
	$rootScope.uploadBySemester = function(path, file, callback){
		
		$rootScope.upload($rootScope.semesterPath + "/" + path, file, callback);
	}
	
	$rootScope.upload = function(path, input, callback){
		
		console.log("upload " + path, input);
		
		try{
			
			$rootScope.loading = true;
			$rootScope.submitted = true;
			
			$("#wait").toast("show");
			
			let file = $("#" + input).get(0).files[0];
			
			firebase.storage().ref().child(path).put(file).then(function(snapshot){

				snapshot.ref.getDownloadURL().then(function(url){
					
					callback(url);
					
					$("#wait").toast("hide");
					
					$rootScope.loading = false;
					$rootScope.submitted = false;
					
					$rootScope.$digest();
					
				}).catch(function(error){
					
					console.error(error);
					
					$("#wait").toast("hide");
					
					$rootScope.loading = false;
					$rootScope.submitted = false;
		
					$rootScope.danger(error);
					
					$rootScope.$digest();
				});
			
			}).catch(function(error){
				
				console.error(error);
				
				$("#wait").toast("hide");
				
				$rootScope.loading = false;
				$rootScope.submitted = false;

				$rootScope.danger(error);
				
				$rootScope.$digest();
			});
		
		}catch(error){
			
			console.error(error);
		}
	}
	
	$rootScope.getValue = function(reference, callback){
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).once("value").then(function(snapshot){
			
			$rootScope.submitted = false;
			$rootScope.loading = false;
			
			$rootScope.$apply(function(){
				$rootScope.none();
			});
			
			console.log(reference, " == ", snapshot.val());
			
			callback(snapshot.val());
			
			$rootScope.$digest();
			
			isValidForm();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.get = function(reference, callback){
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).once("value").then(function(snapshot){
			
			$rootScope.submitted = false;
			$rootScope.loading = false;
			
			$rootScope.$apply(function(){
				$rootScope.none();
			});
			
			console.log(reference, " == ", snapshot.val());
			
			callback(snapshot.exists() ? $rootScope.copy(snapshot.val()) : new Object());
			
			$rootScope.$digest();
			
			isValidForm();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.getKeys = function(reference, callback){
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).once("value").then(function(snapshot){
			
			$rootScope.submitted = false;
			$rootScope.loading = false;
			
			$rootScope.$apply(function(){
				$rootScope.none();
			});
			
			console.log(reference, " == ", snapshot.val());
			
			callback(snapshot.exists() ? Object.keys(snapshot.val()) : new Array());
			
			$rootScope.$digest();
			
			isValidForm();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.getArray = function(reference, callback){
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).once("value").then(function(snapshot){
			
			$rootScope.submitted = false;
			$rootScope.loading = false;
			
			$rootScope.$apply(function(){
				$rootScope.none();
			});
			
			console.log(reference, " == ", snapshot.val());
			
			callback(snapshot.exists() ? $rootScope.values(snapshot.val()) : new Array());
			
			$rootScope.$digest();
			
			isValidForm();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.getActiveArray = function(reference, callback){
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).once("value").then(function(snapshot){
			
			$rootScope.submitted = false;
			$rootScope.loading = false;
			
			$rootScope.$apply(function(){
				$rootScope.none();
			});
			
			console.log(reference, " == ", snapshot.val());
			
			callback(snapshot.exists() ? $rootScope.activeArray(snapshot.val()) : new Array());
			
			$rootScope.$digest();
			
			isValidForm();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.getActive = function(reference, callback){
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).once("value").then(function(snapshot){
			
			$rootScope.submitted = false;
			$rootScope.loading = false;
			
			$rootScope.$apply(function(){
				$rootScope.none();
			});
			
			console.log(reference, " == ", snapshot.val());
			
			callback(snapshot.exists() ? $rootScope.active(snapshot.val()) : new Object());
			
			$rootScope.$digest();
			
			isValidForm();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.getValueBySemester = function(reference, callback){
		
		return $rootScope.getValue($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.getBySemester = function(reference, callback){
		
		return $rootScope.get($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.getArrayBySemester = function(reference, callback){
		
		return $rootScope.getArray($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.getActiveBySemester = function(reference, callback){
		
		return $rootScope.getActive($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.getActiveArrayBySemester = function(reference, callback){
		
		return $rootScope.getActiveArray($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.reset = function(){
		
		$timeout(()=>{
				
			$rootScope.submitted = false;
			$rootScope.none();
			
		}, 3000);
	}
	
	$rootScope.onUpdate = function(reference, callback){
		
		firebase.database().ref(reference).on("value", function(snapshot){
			
			console.log(reference, " == ", snapshot.val());
			
			callback(snapshot.exists() ? snapshot.val() : new Object());
			
			isValidForm();
			
			$rootScope.$digest();
			
		}, function(error){
			
			console.error(error);
			
			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.onUpdateArray = function(reference, callback){
		
		firebase.database().ref(reference).on("value", function(snapshot){
			
			console.log(reference, " == ", snapshot.val());
			
			callback(snapshot.exists() ? Object.values(snapshot.val()) : new Array());
			
			isValidForm();
			
			$rootScope.$digest();
			
		}, function(error){
			
			console.error(error);
			
			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.onUpdateBySemester = function(reference, callback){
		
		return $rootScope.onUpdate($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.onUpdateArrayBySemester = function(reference, callback){
		
		return $rootScope.onUpdateArray($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.setSilent = function(reference, value, callback){
		
		console.log(reference, " == ", value);
		
		firebase.database().ref(reference).set(value).then(function(){
			
			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
			$rootScope.$digest();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.danger(error);
		});
	}
	
	$rootScope.setSilentBySemester = function(reference, value, callback){
		
		return $rootScope.setSilent($rootScope.semesterPath + reference, value, callback);
	}
	
	$rootScope.set = function(reference, value, callback){
		
		console.log(reference, " == ", value);
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).set(value).then(function(){
			
			$rootScope.loading = false;
			
			$rootScope.none();
			
			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
			$rootScope.$digest();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.setBySemester = function(reference, value, callback){
		
		return $rootScope.set($rootScope.semesterPath + reference, value, callback);
	}
	
	$rootScope.setReset = function(reference, value, callback){
		
		console.log(reference, " == ", value);
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).set(value).then(function(){
			
			$rootScope.loading = false;
			
			$rootScope.none();
			
			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
			$rootScope.$digest();
			
			$rootScope.reset();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.setResetBySemester = function(reference, value, callback){
		
		return $rootScope.setReset($rootScope.semesterPath + reference, value, callback);
	}
	
	$rootScope.updateSilent = function(reference, value, callback){
		
		console.log(reference, " == ", value);
		
		firebase.database().ref(reference).update(value).then(function(){
			
			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.danger(error);
		});
	}
	
	$rootScope.updateSilentBySemester = function(reference, value, callback){
		
		return $rootScope.updateSilent($rootScope.semesterPath + reference, value, callback);
	}
	
	$rootScope.update = function(reference, value, callback){
		
		console.log(reference, " == ", value);
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).update(value).then(function(){
			
			$rootScope.loading = false;
			
			$rootScope.none();
			
			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
			$rootScope.$digest();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.updateBySemester = function(reference, value, callback){
		
		return $rootScope.update($rootScope.semesterPath + reference, value, callback);
	}
	
	$rootScope.updateReset = function(reference, value, callback){
		
		console.log(reference, " == ", value);
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();
		
		firebase.database().ref(reference).update(value).then(function(){
			
			$rootScope.loading = false;
			
			$rootScope.none();
			
			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
			$rootScope.$digest();
			
			$rootScope.reset();
			
		}).catch(function(error){
			
			console.error(error);
			
			$rootScope.loading = false;
			$rootScope.submitted = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.updateResetBySemester = function(reference, value, callback){
		
		return $rootScope.updateReset($rootScope.semesterPath + reference, value, callback);
	}
	
	$rootScope.save = function(reference, value, callback){
		
		console.log(reference, " == ", value);
		
		let result = isValidForm();
		
		if(result == null){
			
			$rootScope.submitted = true;
			$rootScope.loading = true;
			
			$rootScope.wait();
			
			firebase.database().ref(reference).set(value).then(function(){
				
				$rootScope.loading = false;

				if(callback != null){
					if(typeof callback === "string"){
						$rootScope.success(callback);
					}else if (typeof callback === "function"){
						callback();
					}
				}
				
				$rootScope.$digest();
				
			}).catch(function(error){
				
				console.error(error);
				
				$rootScope.submitted = false;
				$rootScope.loading = false;

				$rootScope.danger(error);
				
				$rootScope.$digest();
			});
		
		}else{
			
			$rootScope.danger(result);
		}
	}
	
	$rootScope.saveBySemester = function(reference, value, callback){
		
		return $rootScope.save($rootScope.semesterPath + reference, value, callback);
	}
	
	$rootScope.saveReset = function(reference, value, callback){
		
		console.log(reference, " == ", value);
		
		let result = isValidForm();
		
		if(result == null){
			
			$rootScope.submitted = true;
			$rootScope.loading = true;
			
			$rootScope.wait();
			
			firebase.database().ref(reference).set(value).then(function(){
				
				$rootScope.loading = false;

				if(callback != null){
					if(typeof callback === "string"){
						$rootScope.success(callback);
					}else if (typeof callback === "function"){
						callback();
					}
				}
				
				$rootScope.$digest();
				
				$rootScope.reset();
				
			}).catch(function(error){
				
				console.error(error);
				
				$rootScope.submitted = false;
				$rootScope.loading = false;

				$rootScope.danger(error);
				
				$rootScope.$digest();
			});
		
		}else{
			
			$rootScope.danger(result);
		}
	}
	
	$rootScope.saveResetBySemester = function(reference, value, callback){
		
		return $rootScope.saveReset($rootScope.semesterPath + reference, value, callback);
	}
	
	$rootScope.saveSection = function(section, reference, value, callback){
		
		console.log(reference, " == ", value);
		
		let result = isValidSection(section);
		
		if(result == null){
			
			$rootScope.submitted = true;
			$rootScope.loading = true;
			
			$rootScope.wait();
			
			firebase.database().ref(reference).set(value).then(function(){
				
				$rootScope.loading = false;

				if(callback != null){
					if(typeof callback === "string"){
						$rootScope.success(callback);
					}else if (typeof callback === "function"){
						callback();
					}
				}
				
				$rootScope.$digest();
				
				setTimeout(()=>{
					
					$rootScope.submitted = false;
					$rootScope.none();
					
				}, 3000);
				
			}).catch(function(error){
				
				console.error(error);
				
				$rootScope.submitted = false;
				$rootScope.loading = false;

				$rootScope.danger(error);
				
				$rootScope.$digest();
			});
		
		}else{
			
			$rootScope.danger(result);
		}
	}
	
	$rootScope.remove = function(reference, callback){
		
		console.log("Remove :: " + reference);
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();

		firebase.database().ref(reference).remove().then(function(){
			
			$rootScope.loading = false;

			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
			$rootScope.$digest();
		
		}).catch(function(error){
				
			console.error(error);
			
			$rootScope.submitted = false;
			$rootScope.loading = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.removeSilent = function(reference, callback){
		
		console.log("Remove :: " + reference);
		
		firebase.database().ref(reference).remove().then(function(){
			
			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
			$rootScope.$digest();
		
		}).catch(function(error){
				
			console.error(error);
			
			$rootScope.submitted = false;
			$rootScope.loading = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.removeBySemester = function(reference, callback){
		
		return $rootScope.remove($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.removeSilentBySemester = function(reference, callback){
		
		return $rootScope.removeSilent($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.removeReset = function(reference, callback){
		
		console.log("Remove :: " + reference);
		
		$rootScope.submitted = true;
		$rootScope.loading = true;
		
		$rootScope.wait();

		firebase.database().ref(reference).remove().then(function(){
			
			$rootScope.loading = false;

			if(callback != null){
				if(typeof callback === "string"){
					$rootScope.success(callback);
				}else if (typeof callback === "function"){
					callback();
				}
			}
			
			$rootScope.$digest();
			
			$rootScope.reset();
		
		}).catch(function(error){
				
			console.error(error);
			
			$rootScope.submitted = false;
			$rootScope.loading = false;

			$rootScope.danger(error);
			
			$rootScope.$digest();
		});
	}
	
	$rootScope.removeResetBySemester = function(reference, callback){
		
		return $rootScope.removeReset($rootScope.semesterPath + reference, callback);
	}
	
	$rootScope.calculateStudentAttendance = attendance => {
		
		let coursesAttendance = new Object();
		coursesAttendance.courses = new Object();
		coursesAttendance.statuses = {
			"حاضر" : 0,
			"غائب" : 0,
			"متأخر" : 0,
			"معتذر" : 0,
			"المجموع" : 0,
			"النسبة" : 0
		};
						
		Object.entries(attendance).forEach(([course, dates]) => {

			Object.entries(dates).forEach(([date, attend]) => {
				
				if(coursesAttendance.courses[course] == null){
					coursesAttendance.courses[course] = {
						"حاضر" : 0,
						"غائب" : 0,
						"متأخر" : 0,
						"معتذر" : 0,
						"المجموع" : 0,
						"النسبة" : 0
					};
				}
				
				coursesAttendance.courses[course][attend.status]++;
				coursesAttendance.courses[course]["المجموع"]++;
				coursesAttendance.courses[course]["النسبة"] = Math.ceil(100 - (coursesAttendance.courses[course]["غائب"]/coursesAttendance.courses[course]["المجموع"]) * 100);
				
				coursesAttendance.statuses[attend.status]++;
				coursesAttendance.statuses["المجموع"]++;
				coursesAttendance.statuses["النسبة"] = Math.ceil(100 - (coursesAttendance.statuses["غائب"]/coursesAttendance.statuses["المجموع"]) * 100);
			});
		});
		
		console.log(coursesAttendance);
		
		return coursesAttendance;
	}
	
	$rootScope.calculateAttendanceMarks = courseAttendance => {
		
		let attendancePercentage = new Object();
		
		let studentsAttend = new Object();
		
		$rootScope.values(courseAttendance).forEach(students => {
				
			Object.entries(students).forEach(([cpr, attend]) => {
				
				cpr = cpr.toString();
				
				if(studentsAttend[cpr] == null){
					studentsAttend[cpr] = {attend:0, total:0};
				}
				
				if(attend.status != "غائب"){
					studentsAttend[cpr].attend++;
				}
				
				studentsAttend[cpr].total++;
				
				attendancePercentage[cpr] = Math.ceil(studentsAttend[cpr].attend/studentsAttend[cpr].total * 100.0);
			});
		});
		
		console.log(attendancePercentage);
		
		return attendancePercentage;
	}
	
	$rootScope.calculateLevelAttendanceMarks = levelAttendance => {
		
		let attendance = new Object();

		Object.entries(levelAttendance).forEach(([course, dates]) => {

			Object.entries(dates).forEach(([date, students]) => {

				Object.entries(students).forEach(([cpr, attend]) => {
					
					cpr = cpr.toString();
					
					if(attendance[cpr] == null){
						
						attendance[cpr] = new Object();
						attendance[cpr].courses = new Object();
						attendance[cpr].statuses = {
							"حاضر" : 0,
							"غائب" : 0,
							"متأخر" : 0,
							"معتذر" : 0,
							"المجموع" : 0,
							"النسبة" : 0
						};
					}

					if(attendance[cpr].courses[course] == null){
						
						attendance[cpr].courses[course] = new Object();
						attendance[cpr].courses[course].attends = new Array();
						attendance[cpr].courses[course].statuses = {
							"حاضر" : 0,
							"غائب" : 0,
							"متأخر" : 0,
							"معتذر" : 0,
							"المجموع" : 0,
							"النسبة" : 0
						};
					}
					
					attend.date = date;
					attend.night = $rootScope.getNight(date);
					
					attendance[cpr].courses[course].attends.push(attend);
					
					attendance[cpr].courses[course].attends.sort((attend1, attend2) => moment(attend1.date, "DD-MM-YYYY") - moment(attend2.date, "DD-MM-YYYY"));
					
					attendance[cpr].statuses[attend.status]++;
					attendance[cpr].statuses["المجموع"]++;
					
					attendance[cpr].statuses["النسبة"] = Math.ceil(100 - (attendance[cpr].statuses["غائب"]/attendance[cpr].statuses["المجموع"]) * 100);

					attendance[cpr].courses[course].statuses[attend.status]++;
					attendance[cpr].courses[course].statuses["المجموع"]++;
					
					attendance[cpr].courses[course].statuses["النسبة"] = Math.ceil(100 - (attendance[cpr].courses[course].statuses["غائب"]/attendance[cpr].courses[course].statuses["المجموع"]) * 100);
				});
			});
		});
		
		return attendance;
	}
	
	$rootScope.calculateMemberAttendance = memberAttendance => {
		
		let attendance = new Object();

		Object.entries(memberAttendance).forEach(([member, dates]) => {
				
			Object.entries(dates).forEach(([date, attend]) => {

				if(attendance[member] == null){
						
					attendance[member] = {
						"حاضر" : 0,
						"غائب" : 0,
						"متأخر" : 0,
						"معتذر" : 0,
						"المجموع" : 0,
						"النسبة" : 0
					};
				}
				
				attend.date = date;
				attend.night = $rootScope.getNight(date);
				
				attendance[member][attend.status]++;
				attendance[member]["المجموع"]++;
				
				attendance[member]["النسبة"] = Math.ceil(100 - (attendance[member]["غائب"]/attendance[member]["المجموع"]) * 100);
			});
		});
		
		return attendance;
	}
	
	$rootScope.getSortedAttendance = attendance => {
		
		let sortedAttendance = new Object();
		
		Object.entries(attendance).forEach(([course, courseAttendance]) => {
			
			Object.entries(courseAttendance).forEach(([date, attend]) => attend.date = date);
			
			sortedAttendance[course] = Object.values(courseAttendance).sort((attend1, attend2) => moment(attend1.date, "DD-MM-YYYY") - moment(attend2.date, "DD-MM-YYYY"));
		});
		
		return sortedAttendance;
	}
	
	$rootScope.getSortedDates = attendance => {
		
		let sortedDates = $rootScope.values(attendance).flatMap(courseAttendance => {
			return $rootScope.keys(courseAttendance);
		});
		
		sortedDates = sortedDates.sort((date1, date2) => moment(date1, "DD-MM-YYYY") - moment(date2, "DD-MM-YYYY"));
		
		console.log("sortedDates", sortedDates);
		
		return sortedDates;
	}
	
	$rootScope.getAttendanceByDates = attendance => {
		
		let attendanceByDate = new Object();
		
		$rootScope.values(attendance).forEach(courseAttendance => {
			
			Object.entries(courseAttendance).forEach(([date, attend]) => attendanceByDate[date] = attend);			
		});
		
		return attendanceByDate;
	}
	
	$rootScope.print = id => {
		
		if(id != null){
			$("#print").html($("#" + id).html());
		}
		
		$timeout(function(){
			window.print();
		}, 500);
	}
	
	$rootScope.get("config", config => {
		if($rootScope.isListNotEmpty(config)){
			$rootScope.config = config;
		}
		document.title = $rootScope.config.title;
	});
	
	$rootScope.get("labels", labels =>{
		if($rootScope.isListNotEmpty(labels)){
			$rootScope.labels = labels;
		}
	});
	
	$rootScope.getValue("config/currentSemester", currentSemester =>{
		$rootScope.currentSemester = currentSemester;
		$rootScope.semesterPath = "semester-info/" + currentSemester + "/";
	});
	
	$rootScope.isValidElement = function(element){
		return validateElement($("#" + element)) == null;
	}
	
	$rootScope.isValidForm = function(){
		
		let error = isValidForm();
		
		if(error == null){
			return true;
		}else{
			$rootScope.danger(error);
			return false;
		}
	};
	
	$rootScope.isValidSection = function(section){
		
		let error = isValidSection();
		
		if(error == null){
			return true;
		}else{
			$rootScope.danger(error);
			return false;
		}
	};
});

function isValidCpr(cpr){

	if(cpr != null && cpr.toString().length == 9){
		
		cpr = cpr.toString();
		
		var chkdigit = cpr.charAt(8);
	
		var x = cpr.charAt(7)*2 + cpr.charAt(6)*3 + cpr.charAt(5)*4 + cpr.charAt(4)*5 + cpr.charAt(3)*6 + cpr.charAt(2)*7 + cpr.charAt(1)*8 + cpr.charAt(0)*9;

		var z = x%11;
		
		var calcdigit;

		if(z == 0 || z == 1){

			calcdigit = 0;

		} else {

			calcdigit  = 11 - z;
		}
		
		return chkdigit == calcdigit;
		
	}else{
		
		return false;
	}
}

$(document).mousedown((event)=>{

	if ($.fn.select2 != null
		&& $(event.target).is(".form-select")
		&& !$(event.target).hasClass("select2")){
		
		$(event.target).blur();
		
		if ($(event.target).closest(".modal").length != 0){
			$(event.target).select2({theme: "bootstrap5", dropdownParent: $(event.target).parent()});
		}else{
			$(event.target).select2({theme: "bootstrap5"});
		}
		
		$(event.target).addClass("select2");
		$(event.target).next().addClass("form-select is-valid");
		$(event.target).select2("open");
		setTimeout(()=> $(event.target).next().find("select2-search__field").focus());
	}
});

$(document).keypress(function(event){
	
	let key = window.event.keyCode || event.which || event.charCode;
	
	if(event.target.type == "tel"){
      	
		return key <= 31 || (key >= 48 && key <= 57);
	}

	if(event.target.type == "number"){
	
		return key <= 31 || (key >= 48 && key <= 57) || key == 46;
	}
});

$(document).on("input", function(event){
	
	validateElement(event.target);
});

window.validateElement = function(element){
	
	if($(element).attr("type") == "checkbox" || $(element).attr("type") == "radio"){
		
		let name = $(element).attr("name");
		
		if($(element).attr("required") != null && $("input[name='" + name + "']:checked").length == 0){
			
			return setMessage(element, "يرجى اختيار " + $(element).attr("placeholder"));
		}
		
	}else{
		
		if($(element).val() == null || $(element).val().length == 0){
			
			if($(element).attr("required") != null){
				
				return setMessage(element, "يرجى ادخال " + $(element).attr("placeholder"));
			}
		
		}else{
			
			if($(element).hasClass("cpr")){
					
				if($(element).val().length != 9){
					
					return setMessage(element, $(element).attr("placeholder") + " يجب أن يتكون من تسعة أرقام");
				}
				
				if(!isValidCpr($(element).val())){
					
					return setMessage(element, $(element).attr("placeholder") + " المدخل غير صحيح");
				}
			}
			
			if($(element).hasClass("name")){
				
				if($(element).val().trim().split(" ").length <= 3){
					
					return setMessage(element, $(element).attr("placeholder") + " يجب أن يتكون من أربع أسماء");
				}
			}
			
			if($(element).hasClass("mobile")){
				
				if(!$(element).val().startsWith("3") && !$(element).val().startsWith("6")){
					
					return setMessage(element, $(element).attr("placeholder") + " يجب أن يبدأ ب 3 أو 6");
				}
				
				if($(element).val().length != 8){
					
					return setMessage(element, $(element).attr("placeholder") + " يجب أن يتكون من ثمان أرقام");
				}
			}
		}
	}
	
	return setMessage(element, null);
}

window.setMessage = function(element, message){

	if($(element).closest(".form-group").find(".invalid-feedback").length == 0){
		
		$(element).closest(".form-group").append("<div class='invalid-feedback d-inline'></div>");
		
	}else{
		
		$(element).closest(".form-group").find(".invalid-feedback").html(message);
	}
	
	if (message != null){
		
		$(element).removeClass("is-valid");
		$(element).addClass("is-invalid");
			
		if($.fn.select2 != null && $(element).is("select") && $(element).data("select2")){
			$(element).next().removeClass("is-valid");
			$(element).next().addClass("is-invalid");
		}

	} else {
		
		$(element).removeClass("is-invalid");
		$(element).addClass("is-valid");

		if($.fn.select2 != null && $(element).is("select") && $(element).data("select2")){
			$(element).next().removeClass("is-invalid");
			$(element).next().addClass("is-valid");
		}
	}
	
	return message;
}

window.isValidForm = function(){

	let result = null;
	
	$($(":input").get().reverse()).each(function(){
		
		let message = validateElement($(this));
		
		if(message != null){
			
			result = message;
			
			$(this).focus();
		}
	});
	
	return result;
}

window.isValidSection = function(section){

	let result = null;
	
	$($("#" + section + " :input").get().reverse()).each(function(){
		
		let message = validateElement($(this));
		
		if(message != null){
			
			result = message;
			
			$(this).focus();
		}
	});
	
	return result;
}