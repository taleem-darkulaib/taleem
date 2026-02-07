application.controller("controller", ($scope, $rootScope, $timeout, $sce, $location) =>{

	$scope.messages = new Object();
	$scope.submitted = false;
	$scope.info("يرجى ادخال رقم الهاتف والرسالة النصية");
	$scope.send = {mobiles:"", content:""};
	
	$scope.onUpdate("whatsapp", messages => {
		
		$scope.messages = messages;
	});
	
	$scope.sendWhatsApp = ()=> {
		
		let mobiles = $scope.send.mobiles.trim().split("\n").filter(mobile => mobile.trim().length != 0 && mobile.trim().length == 8 && !isNaN(mobile.trim())).map(mobile => mobile.trim());
		
		$scope.wait();
		
		$scope.submitted = true;
		
		mobiles.forEach((mobile, index) => {
			
			let message = new Object();
			message.id = moment().valueOf() + index;
			message.send = false;
			message.time = moment().format("DD-MM-YYYY HH:mm:ss");
			message.mobile = mobile;
			message.content = $scope.send.content;
			
			console.log(message);
			
			$scope.setSilent("whatsapp/" + message.id, message, ()=> {

				$scope.success("تم حفظ الرسالة النصية بنجاح");
				
				$timeout(()=>{
					$scope.submitted = false;
					$scope.info("يرجى ادخال رقم الهاتف والرسالة النصية");
				}, 3000);
			});
		});
	}
	
	$scope.deleteMessage = message => {
		
		$scope.removeSilent("whatsapp/" + message.id);
	}
	
	$scope.deleteSent = ()=> {
		
		$scope.wait();
		
		$scope.submitted = true;
		
		$scope.keys($scope.messages).forEach(key =>{
			
			if($scope.messages[key].send){
				delete $scope.messages[key];
			}
		});

		$scope.setSilent("whatsapp", $scope.messages, ()=> {

			$scope.success("تم حذف المرسل بنجاح");
			
			$timeout(()=>{
				$scope.submitted = false;
				$scope.info("يرجى ادخال رقم الهاتف والرسالة النصية");
			}, 3000);
		});
	}
});