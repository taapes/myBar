(function() {
    var app = angular.module('MyBar', ['ui.bootstrap']);

    app.controller('MyBarController', ['$http', '$scope', '$modal', '$log', function($http, $scope, $modal, $log) {
            $scope.predicate = 'name';
            $scope.Bars = [];
            $scope.bar = {};
            $scope.newAtmo;
            $scope.newType;
            $scope.hideminusbar = true;
            $scope.hideminushh = true;
            $scope.barHours =
                    [
                        {
                            Monday: true,
                            Tuesday: true,
                            Wednesday: true,
                            Thursday: true,
                            Friday: true,
                            Saturday: true,
                            Sunday: true,
                            open: "11:00",
                            close: "03:00"
                        }
                    ];
            $scope.hhHours =
                    [
                        {
                            Monday: true,
                            Tuesday: true,
                            Wednesday: true,
                            Thursday: true,
                            Friday: true,
                            Saturday: false,
                            Sunday: false,
                            start: "16:00",
                            end: "19:00"
                        }
                    ];
            $scope.atmosphere = [];

            $scope.type = [];

            $http.get('/getBar.php')
                    .success(function(response, status, headers, config)
                    {
                        //alert(response.id);
                        $scope.Bars = response.bars;
                        console.log(response.message);
                    })
                    .error(function(response, status, headers, config)
                    {
                        alert("Error: " + response.message);
                        console.log(response.message);
                    });

            $http.get('/getAtmosphere.php')
                    .success(function(response, status, headers, config)
                    {
                        $scope.atmosphere = response.atmosphere;
                        console.log(response.message);
                    })
                    .error(function(response, status, headers, config)
                    {
                        alert("Error: " + response.message);
                        console.log(response.message);
                    });

            $http.get('/getType.php')
                    .success(function(response, status, headers, config)
                    {
                        $scope.type = response.type;
                        console.log(response.message);
                    })
                    .error(function(response, status, headers, config)
                    {
                        alert("Error: " + response.message);
                        console.log(response.message);
                    });

            $scope.removeBar = function(newBar) {
                $http.post('/removeBar.php', newBar)
                        .success(function(data, status, headers, config)
                        {
                            //alert(data + status + "SUCCESS");
                            var index = $scope.Bars.indexOf(newBar);
                            if (index > -1)
                                $scope.Bars.splice(index, 1);
                            console.log(status + ' - ' + data);
                        })
                        .error(function(data, status)
                        {
                            alert(status + ' - ' + data);
                            console.log('error');
                        });
            };

            $scope.addNewAtmo = function() {
                $scope.data = {atmo: $scope.newAtmo};
                $http.post('/addAtmosphere.php', $scope.data)
                        .success(function(data, status, headers, config)
                        {
                            $scope.atmosphere.push($scope.newAtmo);
                            $scope.newAtmo = "";
                            //alert(data + status + "SUCCESS");
                            console.log(status + ' - ' + data);
                        })
                        .error(function(data, status)
                        {
                            alert(status + ' - ' + data);
                            console.log('error');
                        });
            };

            $scope.addNewType = function() {
                $scope.data = {type: $scope.newType};
                $http.post('/addType.php', $scope.data)
                        .success(function(data, status, headers, config)
                        {
                            $scope.type.push($scope.newType);
                            $scope.newType = "";
                            //alert(data + status + "SUCCESS");
                            console.log(status + ' - ' + data);
                        })
                        .error(function(data, status)
                        {
                            alert(status + ' - ' + data);
                            console.log('error');
                        });
            };

            $scope.showAddBarHours = function(hours) {
                return hours === $scope.barHours[$scope.barHours.length - 1];
            };

            $scope.showRemoveBarHours = function() {
                return 1 !== $scope.barHours[$scope.barHours.length];
            };

            $scope.showRemoveHHHours = function() {
                return 1 !== $scope.hhHours[$scope.hhHours.length];
            };

            $scope.showAddHHHours = function(hours) {
                return hours === $scope.hhHours[$scope.hhHours.length - 1];
            };

            $scope.addBarHours = function() {
                $scope.hideminusbar = false;
                $scope.barHours.push
                        (
                                {
                                    Monday: true,
                                    Tuesday: true,
                                    Wednesday: true,
                                    Thursday: true,
                                    Friday: true,
                                    Saturday: true,
                                    Sunday: true,
                                    open: "11:00",
                                    close: "03:00"
                                }
                        );
            };

            $scope.removeBarHours = function(hours) {
                var index = $scope.barHours.indexOf(hours);
                if (index > -1)
                    $scope.barHours.splice(index, 1);
                if($scope.barHours.length ===1)
                {
                    $scope.hideminusbar=true;
                }
            };

            $scope.removeHHHours = function(hours) {
                var index = $scope.hhHours.indexOf(hours);
                if (index > -1)
                    $scope.hhHours.splice(index, 1);
                if($scope.hhHours.length ===1)
                {
                    $scope.hideminushh=true;
                }
            };

            $scope.addHHHours = function() {
                $scope.hideminushh = false;
                $scope.hhHours.push
                        (
                                {
                                    Monday: true,
                                    Tuesday: true,
                                    Wednesday: true,
                                    Thursday: true,
                                    Friday: true,
                                    Saturday: false,
                                    Sunday: false,
                                    start: "16:00",
                                    end: "19:00"
                                }
                        );
            };

            $scope.addHoursToBar = function()
            {
                for (i = 0; i < $scope.barHours.length; i++)
                {
                    alert($scope.barHours[i].Monday);
                    if ($scope.barHours[i].Monday)
                    {
                        $scope.bar.Monday =
                                {
                                    isClosed: false,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Monday)
                            {
                                $scope.bar.Monday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                            else
                            {
                                $scope.bar.Monday = {noHH: true};
                            }
                        }
                    }
                    else
                    {
                        $scope.bar.Monday = {isClosed: true};
                    }

                    if ($scope.barHours[i].Tuesday)
                    {
                        $scope.bar.Tuesday =
                                {
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Tuesday)
                            {
                                $scope.bar.Tuesday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                            else
                            {
                                $scope.bar.Tuesday = {noHH: true};
                            }
                        }
                    }
                    else
                    {
                        $scope.bar.Tuesday = {isClosed: true};
                    }

                    if ($scope.barHours[i].Wednesday)
                    {
                        $scope.bar.Wednesday =
                                {
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Wednesday)
                            {
                                $scope.bar.Wednesday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                            else
                            {
                                $scope.bar.Wednesday = {noHH: true};
                            }
                        }
                    }
                    else
                    {
                        $scope.bar.Wednesday = {isClosed: true};
                    }

                    if ($scope.barHours[i].Thursday)
                    {
                        $scope.bar.Thursday =
                                {
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Thursday)
                            {
                                $scope.bar.Thursday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                            else
                            {
                                $scope.bar.Thursday = {noHH: true};
                            }
                        }
                    }
                    else
                    {
                        $scope.bar.Thursday = {isClosed: true};
                    }

                    if ($scope.barHours[i].Friday)
                    {
                        $scope.bar.Friday =
                                {
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Friday)
                            {
                                $scope.bar.Friday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                            else
                            {
                                $scope.bar.Friday = {noHH: true};
                            }
                        }
                    }
                    else
                    {
                        $scope.bar.Friday = {isClosed: true};
                    }

                    if ($scope.barHours[i].Saturday)
                    {
                        $scope.bar.Saturday =
                                {
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Saturday)
                            {
                                $scope.bar.Saturday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                            else
                            {
                                $scope.bar.Saturday = {noHH: true};
                            }
                        }
                    }
                    else
                    {
                        $scope.bar.Saturday = {isClosed: true};
                    }

                    if ($scope.barHours[i].Sunday)
                    {
                        $scope.bar.Sunday =
                                {
                                    isClosed: false,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Sunday)
                            {
                                $scope.bar.Sunday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                            else
                            {
                                $scope.bar.Sunday = {noHH: true};
                            }
                        }
                    }
                    else
                    {
                        $scope.bar.Sunday = {isClosed: true};
                    }


                }
            };

            $scope.addBar = function() {
                $scope.addHoursToBar();
                $http.post('/addBar.php', $scope.bar)
                        .success(function(response, status, headers, config)
                        {
                            //alert(response.message +"\n"+response.name);
                            $scope.Bars.push($scope.bar);
                            $scope.bar = {};
                            $scope.barHours =
                                    [
                                        {
                                            Monday: true,
                                            Tuesday: true,
                                            Wednesday: true,
                                            Thursday: true,
                                            Friday: true,
                                            Saturday: true,
                                            Sunday: true,
                                            open: "11:00",
                                            close: "03:00"
                                        }
                                    ];
                            $scope.hhHours =
                                    [
                                        {
                                            Monday: true,
                                            Tuesday: true,
                                            Wednesday: true,
                                            Thursday: true,
                                            Friday: true,
                                            Saturday: false,
                                            Sunday: false,
                                            start: "16:00",
                                            end: "19:00"
                                        }
                                    ];
                            console.log(status + ' - ' + data);
                        })
                        .error(function(data, status)
                        {
                            alert("OOPS! Something went wrong!\n" + data);
                            console.log('error');
                        });
            };

            $scope.editBar = function(newBar) {
                $scope.bar = newBar;
                $scope.barHours = [];
                $scope.hhHours = [];
                alert($scope.bar.Monday.isClosed);
                /*
                if(!$scope.bar.Monday.isClosed)
                {
                    $scope.barHours.push({Monday:true, open: $scope.bar.Monday.open, close: $scope.bar.Monday.close});
                    if(!$scope.bar.Monday.noHH)
                    {
                        for(i=0;i<$scope.bar.Monday.happyHour.length; i++)
                        {
                            $scope.hhHours.push({Monday:true, start: $scope.bar.Monday.happyHour.start, end: $scope.bar.Monday.happyHour.close});
                        }
                    }
                }*/
               
            };

            $scope.open = function (newBar) {
                var modalInstance = $modal.open({
                  templateUrl: 'modal.html',
                  controller: 'ModalInstanceCtrl',
                  size: 'lg',
                  resolve: {
                    thisBar: function () {
                      return newBar;
                    }
                  }
                });
            };

        }]);
    
    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, thisBar) {
        $scope.bar = thisBar;
       
        $scope.ok = function () {
          $modalInstance.close();
        };
       
      });
})();
