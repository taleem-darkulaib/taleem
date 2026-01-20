application.controllerProvider.register("rooms", ($scope, $timeout) => {
	
	$scope.areas = new Object();
	$scope.areaList = new Array();
	
	$scope.rooms = new Object();

	$scope.get("areas", areas => {
		
		$scope.areas = areas;
		
		$scope.areaList = $scope.activeIndexedArray(areas);
		
		if($scope.isListEmpty($scope.areaList)){
			
			$scope.addArea(0);
		}
	});
	
	$scope.get("rooms", rooms => {
		$scope.rooms = rooms;
	});

	$scope.upArea = index => {
		
		[$scope.areaList[index], $scope.areaList[index - 1]] = [$scope.areaList[index - 1], $scope.areaList[index]];
		
		$timeout(isValidForm);
	}

	$scope.downArea = index => {
		
		[$scope.areaList[index], $scope.areaList[index + 1]] = [$scope.areaList[index + 1], $scope.areaList[index]];
		
		$timeout(isValidForm);
	}

	$scope.addArea = index => {
		
		let area = new Object();
		
		area.id = moment().valueOf();
		area.time = moment().format("DD-MM-YYYY HH:mm:ss");
		area.active = true;
		area.index = index;
		area.rooms = new Array();
		
		$scope.addRoom(area, 0);
		
		$scope.areas[area.id] = area;
		
		$scope.areaList.splice(index, 0, area);
		
		$timeout(function(){
			isValidForm();
			$("input[name='areas']").eq(index).focus();
		});
	}

	$scope.deleteArea = index => {
		
		let area = $scope.areaList[index];
		
		area.time = moment().format("DD-MM-YYYY HH:mm:ss");
		area.active = false;
		area.index = -1;
		
		$scope.areaList.splice(index, 1);
		
		$timeout(isValidForm);
	}

	$scope.upRoom = (area, index) => {
		
		[area.rooms[index], area.rooms[index - 1]] = [area.rooms[index - 1], area.rooms[index]];

		$timeout(isValidForm);
	}
	
	$scope.downRoom = (area, index) => {
		
		[area.rooms[index], area.rooms[index + 1]] = [area.rooms[index + 1], area.rooms[index]];

		$timeout(isValidForm);
	}
	
	$scope.addRoom = (area, index) => {
		
		let room = new Object();
		
		room.id = moment().valueOf();
		room.time = moment().format("DD-MM-YYYY HH:mm:ss");
		room.active = true;
		room.index = index;
		
		$scope.rooms[room.id] = room;
		
		area.rooms.splice(index, 0, room);
		
		let areaIndex = $scope.areaList.indexOf(area);

		$timeout(function(){
			isValidForm();
			$("#room-" + areaIndex + "-" + index).focus();
		});
	}
	
	$scope.deleteRoom = (area, index) => {
		
		let room = area.rooms[index];
		
		room.time = moment().format("DD-MM-YYYY HH:mm:ss");
		room.active = false;
		room.index = -1;
		
		area.rooms.splice(index, 1);

		$timeout(isValidForm);
	}
	
	$scope.saveAreas = ()=> {
		
		$scope.areaList.forEach((area, index) => {
			
			area.index = index;
			area.rooms.forEach((room, index) => room.index = index);
		});
		
		$scope.rooms = Object.fromEntries($scope.areaList.flatMap(area => area.rooms).map(room => [room.id, room]));
		
		$scope.set("areas", $scope.areas, ()=> {
			
			$scope.set("rooms", $scope.rooms, "تم حفظ قائمة المناطق بنجاح");
		});
	}
});