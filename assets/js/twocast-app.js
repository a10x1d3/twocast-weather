var app = angular.module('temperature-app', [])

.controller('temperatureCtrl', function($scope, $http, $window) {
	$scope.windowWidth = $window.innerWidth;
	$scope.Routes = [];
	$scope.clothing = clothing;
	$scope.onecallURL = api.fullRequestURL;
	$scope.winWidth = 0;

	$scope.ui = {
		activeTab: 'Clothing',
		tabs : [
			{
				title: "Routes"
			},
			{
				title: "Clothing"
			},
			{
				title: "API"
			}
		]
	};

	$scope.setActiveTab = function(tabTitle)
	{
		$scope.ui.activeTab = tabTitle;
		console.log("Setting tab: " + tabTitle + " as active");
		console.log($scope.ui.activeTab);
	};

	$scope.FetchData = function () {
		console.log("fetchData() fired");
		$http.get($scope.onecallURL)
			.success(function (response)
				{
					$scope.forecast = response;
					$scope.parseForecast();
				}
			);
	};
	
    $scope.parseForecast = function () {
		// Declaring $scope.hours here ensures forecast content
		// in data array is fresh when re-fetching from API 
		$scope.hours = [];
		
		$scope.forecast.hourly.forEach(hour => {
			var startTimeObj = new Date(hour.dt * 1000);

			// January, February, etc.
			hour.startLongMonth = startTimeObj.toLocaleString("en-US", { month: "long" });

			// Jan, Feb, etc.
			hour.startShortMonth = startTimeObj.toLocaleString("en-US", { month: "short" });

			// Monday, Tuesday, etc.
			hour.startLongDay = startTimeObj.toLocaleString("en-US", { weekday: "long" });
			
			// Mon, Tue, etc.
			hour.startShortDay = startTimeObj.toLocaleString("en-US", { weekday: "short" });

			// 0900, 1000, 1100, etc.
			hour.startHour = startTimeObj.getHours().toString();
			if ( hour.startHour.length == 1 )
			{
				hour.startHour = '0' + hour.startHour;
			}

			// 08, 09, 10, 11, etc.
			hour.startDay = startTimeObj.getDate().toString();
			
			if ( hour.startDay.length == 1 )
			{
				hour.startDay = '0' + hour.startDay;
			}

			// Build text options for route's hour select
			hour.longOptText = hour.startHour + '00  |  ' + hour.startLongDay + ' ' + hour.startDay + ', ' + hour.startLongMonth;
			hour.shortOptText = hour.startHour + ' on  ' + hour.startShortDay + ' ' + hour.startDay + ', ' + hour.startShortMonth;

			hour.weatherIconURL = 'http://openweathermap.org/img/wn/' + hour.weather[0].icon + '@2x.png';
			hour.temp = Math.floor(hour.temp);
			hour.feels_like = Math.floor(hour.feels_like);
			hour.wind_gust = Math.floor(hour.wind_gust);

			$scope.hours.push(hour);
		});
	};
	
	$scope.AddRoute = function () {
		routeIndex = $scope.Routes.length;
		routeID = "Route" + ($scope.Routes.length + 1).toString();
		
		$scope.Routes.push({});
		$scope.Routes[routeIndex].RouteID = routeID;
		$scope.Routes[routeIndex].clothing = {
			Head: [], 
			Neck: [],
			Torso: [],
			Hands: [],
			Legs: [],
			Ankles: [],
			Feet: []
		}
	};
	
	$scope.setClothing = function(RouteIndex)
	{
		feelsLike = $scope.Routes[RouteIndex].data.feels_like;
		$scope.clothing.forEach(category => {
			
			$scope.Routes[RouteIndex].clothing[category.categoryName] = [];
			category.clothing.forEach(clothingArticle => {
				if ( clothingArticle.min <= feelsLike && clothingArticle.max >= feelsLike)
				{
					$scope.Routes[RouteIndex].clothing[category.categoryName].push(clothingArticle)
				}
			});

		});
	};

	$scope.RemoveRoute = function(RouteIndex)
	{
		$scope.Routes.splice(RouteIndex, 1);
	};

	angular.element($window).bind('resize', function () {
		$scope.windowWidth = $window.innerWidth;
		$scope.$digest();
	});	
});