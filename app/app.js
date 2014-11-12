'use strict';

(function() {
    var app = angular.module('MyBar', ['ngRoute', 'toaster', 'ui.bootstrap', 'angularUtils.directives.dirPagination', /*'google-maps'.ns(),*/ ]);
    
    /*
    app.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
        GoogleMapApi.configure({
            key: 'AIzaSyByqBJd7Rr_GEQDEzT9l5aZUfFJngHtoEs',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    }]);
    */
    
    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                    when('/addBar', {
                        templateUrl: '/views/addBar.html',
                        controller: 'AddBarController'
                    }).
                    when('/myBar', {
                        templateUrl: '/views/allBars.html',
                        controller: 'AllBarsController'
                    }).
                    when('/viewBar/:barName', {
                        templateUrl: '/views/viewBar.html',
                        controller: 'ViewBarController'
                    }).
                    when('/editBar/:barName', {
                        templateUrl: '/views/addBar.html',
                        controller: 'EditBarController'
                    }).
                    when('/account/:username', {
                        templateUrl: '/views/account.html',
                        controller: 'AccountController'
                    }).
                    when('/about', {
                        templateUrl: '/views/about.html',
                        controller: 'authCtrl'
                    }).
                    when('/login', {
                        title: 'Login',
                        templateUrl: '/views/login.html',
                        controller: 'authCtrl'
                    })
                    .when('/logout', {
                        title: 'Logout',
                        templateUrl: '/views/login.html',
                        controller: 'logoutCtrl'
                    })
                    .when('/signup', {
                        title: 'Signup',
                        templateUrl: '/views/signup.html',
                        controller: 'authCtrl'
                    })
                    .when('/', {
                        title: 'myBar',
                        templateUrl: '/views/allBars.html',
                        controller: 'AllBarsController',
                    })
                    .otherwise({
                        redirectTo: '/myBar'
                    });
        }]);
    
    app.run(function($rootScope, $location, Data, $routeParams) {
    	$rootScope.testsys = false;
        $rootScope.$on("$routeChangeStart", function(event, next, current) {
            $rootScope.authenticated = false;
            Data.get('session').then(function(results) {
                if (results.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                    $rootScope.admin = results.admin;
                    $rootScope.username = results.username;
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl === '/addBar' || nextUrl.substring(0, 8) === "/editBar") {
                        if ($rootScope.admin === true) {

                        } else {
                            $location.path("/login");
                        }
                    }
                    if (nextUrl.substring(0, 8) === '/account') {
                        if ($rootScope.username !== $routeParams.username) {
                            $location.path("/myBar");
                        }
                    }
                } else {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login' || nextUrl == '/myBar' || nextUrl == '/about' || nextUrl.substring(0, 9) == "/viewBar/") {

                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    });
    
    app.controller('authCtrl', function($scope, $rootScope, $routeParams, $location, $http, Data) {
        //initially set those objects to null to avoid undefined error

        $scope.login = {};
        $scope.signup = {};
        $scope.doLogin = function(user) {
            Data.post('login', {
                user: user
            }).then(function(results) {
                Data.toast(results);

                if (results.status == "success") {
                    $scope.login = {};
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                    $rootScope.admin = results.admin;
                    $location.path('myBar');
                }
            });
        };
        $scope.account = function(username) {
            $location.url('/account/' + username);
        };
        $scope.signup = {email: '', password: '', name: '', username: ''};
        $scope.signUp = function(user) {
            Data.post('signUp', {
                user: user
            }).then(function(results) {
                Data.toast(results);
                if (results.status == "success") {

                    $location.path('myBar');
                }
            });
        };
        $scope.logout = function() {
            Data.get('logout').then(function(results) {
                Data.toast(results);
                $rootScope.authenticated = true;
                $rootScope.uid = '';
                $rootScope.name = '';
                $rootScope.email = '';
                $rootScope.admin = false;
                $location.path('login');
            });
        };
    }); //AuthCtrl

    app.controller('AccountController', ['$http', '$scope', '$log', "$location", function($http, $scope, $log, $location) {

        }]); //AccountController
    
    app.controller('AllBarsController', ['$http', '$scope', '$log', "$location", function($http, $scope, $log, $location) {
            $scope.Bars = [];
            $scope.totalBars = 0;
            $scope.barsPerPage = 10;


            $scope.pagination = {
                current: 1
            };

            $scope.getResultsPage = function(pageNumber) {
                // this is just an example, in reality this stuff should be in a service
                $http.get('/php/getBars.php?page=' + pageNumber)
                        .success(function(response, status, headers, config)
                        {
                            //alert(response.id);

                            $scope.Bars = response.bars;
                            $scope.totalBars = response.total;
                        })
                        .error(function(response, status, headers, config)
                        {
                            alert("Error: " + response.message);
                            console.log(response.message);
                        });
            };

            $scope.getResultsPage(1);

            $scope.pageChangeHandler = function(num) {
                $scope.getResultsPage(num);
                $scope.pagination.current = num;
            };

            $scope.editBar = function(newName) {
                $location.url('/editBar/' + newName);
            };
            $scope.removeBar = function(newId) {
                $http.post('/php/removeBar.php', {'id': newId})
                        .success(function(response, status, headers, config)
                        {
                            if (response.success === 0) {
                                $scope.message = response.message;
                            }
                            else if (response.success === 1) {
                                $scope.message = response.message;
                                for (var i = $scope.Bars.length - 1; i >= 0; i--) {
                                    if ($scope.Bars[i].id === newId) {
                                        $scope.Bars.splice(i, 1);
                                    }
                                }
                            }

                            console.log(status + ' - ' + response.message + response.img);
                        })
                        .error(function(data, status)
                        {
                            alert("OOPS! Something went wrong!\n" + data);
                            console.log('error');
                        });
            };
        }]); //AllBarsController

    app.controller('AddBarController', ['$http', '$scope', '$log', "$location", "$rootScope", "fileUpload", "toaster", function($http, $scope, $log, $location, $rootScope, fileUpload, toaster) {
            $scope.bar = {};
            $scope.hideminusbar = true;
            $scope.hideminushh = true;
            $scope.message;
            var open = new Date(2014, 1, 1, 11, 0, 0, 0);
            var close = new Date(2014, 1, 1, 3, 0, 0, 0);
            var start = new Date(2014, 1, 1, 16, 0, 0, 0);
            var end = new Date(2014, 1, 1, 19, 0, 0);
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
                            open: open,
                            close: close
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
                            start: start,
                            end: end
                        }
                    ];
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
                $scope.addBaseBarHours();
            };
            $scope.removeBarHours = function(hours) {
                var index = $scope.barHours.indexOf(hours);
                if (index > -1)
                    $scope.barHours.splice(index, 1);
                if ($scope.barHours.length === 1)
                {
                    $scope.hideminusbar = true;
                }
            };
            $scope.removeHHHours = function(hours) {
                var index = $scope.hhHours.indexOf(hours);
                if (index > -1)
                    $scope.hhHours.splice(index, 1);
                if ($scope.hhHours.length === 1)
                {
                    $scope.hideminushh = true;
                }
            };
            $scope.addHHHours = function() {
                $scope.hideminushh = false;
                $scope.addBaseHHHours();
            };
            $scope.addHoursToBar = function() {
                $scope.bar.Monday = {isClosed: true, noHH: true};
                $scope.bar.Tuesday = {isClosed: true, noHH: true};
                $scope.bar.Wednesday = {isClosed: true, noHH: true};
                $scope.bar.Thursday = {isClosed: true, noHH: true};
                $scope.bar.Friday = {isClosed: true, noHH: true};
                $scope.bar.Saturday = {isClosed: true, noHH: true};
                $scope.bar.Sunday = {isClosed: true, noHH: true};
                var i;
                var j;
                for (i = 0; i < $scope.barHours.length; i++)
                {
                    if ($scope.barHours[i].Monday)
                    {
                        $scope.bar.Monday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Monday)
                            {
                                $scope.bar.Monday.noHH = false;
                                $scope.bar.Monday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Tuesday)
                    {
                        $scope.bar.Tuesday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Tuesday)
                            {
                                $scope.bar.Tuesday.noHH = false;
                                $scope.bar.Tuesday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Wednesday)
                    {
                        $scope.bar.Wednesday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Wednesday)
                            {
                                $scope.bar.Wednesday.noHH = false;
                                $scope.bar.Wednesday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Thursday)
                    {
                        $scope.bar.Thursday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Thursday)
                            {
                                $scope.bar.Thursday.noHH = false;
                                $scope.bar.Thursday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Friday)
                    {
                        $scope.bar.Friday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Friday)
                            {
                                $scope.bar.Friday.noHH = false;
                                $scope.bar.Friday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Saturday)
                    {
                        $scope.bar.Saturday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Saturday)
                            {
                                $scope.bar.Saturday.noHH = false;
                                $scope.bar.Saturday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Sunday)
                    {
                        $scope.bar.Sunday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Sunday)
                            {
                                $scope.bar.Sunday.noHH = false;
                                $scope.bar.Sunday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                }
            };
            $scope.uploadFile = function(id) {
                var file = $scope.barThumb;
                console.info('file is ' + JSON.stringify(file));
                var uploadUrl = "/php/upload.php";
                fileUpload.uploadFileToUrl(file, uploadUrl, id);
            };
            $scope.pop = function(type, title, message) {
                toaster.pop(type, title, message);
            };
            $scope.addBar = function() {
                $scope.addHoursToBar();
                var atm = $scope.bar.atmosphere.split(",");
                $scope.bar.atmosphere = [];
                var i;
                for (i = 0; i < atm.length; i++) {
                    $scope.bar.atmosphere.push(atm[i].toString().trim());
                }
                var type = $scope.bar.type.split(",");
                $scope.bar.type = [];
                for (i = 0; i < type.length; i++) {
                    $scope.bar.type.push(type[i].toString().trim());
                }
                $scope.bar.img = [];
                if ($scope.barThumb) {
                    $scope.bar.thumb = $scope.barThumb.name;
                }
                $scope.bar.reviews = [];
                $http.post('/php/addBar.php', $scope.bar)
                        .success(function(response, status, headers, config)
                        {
                            if (response.success === 0) {
                                $scope.pop('error', "ERROR!", response.message);
                            }
                            else if (response.success === 1) {
                                $scope.pop('success', "SUCCESS!", $scope.bar.name + " added!");
                                $scope.uploadFile(response.id);
                            }
                            var temp = $scope.bar.name;
                            $scope.bar = {};
                            document.getElementById('photo').value = null;
                            $scope.setBaseBarHours();
                            $scope.setBaseHHHours();
                            console.log(status + ' - ' + response.message);
                            $location.url('/viewBar/' + temp);
                        })
                        .error(function(data, status)
                        {
                            $scope.pop('error', "ERROR!", "OOPS! Something went wrong!\n" + data);
                            console.log('error');
                        });
            };
            $scope.testData = function() {
                $scope.bar = {"price": "$", "name": "TestBar", "neighborhood": "TestNeighborhood", "atmosphere": "test1, test2, test3", "type": "test1, test2, test3", "street": "testStreet", "city": "testCity", "state": "testState", "zip": "testZip", "deal": "testDeal", "instagram": "testInsta"};
            };
            $scope.clear = function() {
                $scope.bar = {price: "$"};
                $scope.hideminusbar = true;
                $scope.hideminushh = true;
                $scope.setBaseBarHours();
                $scope.setBaseHHHours();
                document.getElementById('photo').value = null;
            };
            $scope.setBaseBarHours = function() {
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
                                open: open,
                                close: close
                            }
                        ];
                console.log("Set bar hours");
            };
            $scope.setBaseHHHours = function() {

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
                                start: start,
                                end: end
                            }
                        ];
                console.log("Set hh hours");
            };
            $scope.addBaseBarHours = function() {
                $scope.barHours.push(
                        {
                            Monday: true,
                            Tuesday: true,
                            Wednesday: true,
                            Thursday: true,
                            Friday: true,
                            Saturday: true,
                            Sunday: true,
                            open: open,
                            close: close
                        }
                );
            };
            $scope.addBaseHHHours = function() {

                $scope.hhHours.push(
                        {
                            Monday: true,
                            Tuesday: true,
                            Wednesday: true,
                            Thursday: true,
                            Friday: true,
                            Saturday: false,
                            Sunday: false,
                            start: start,
                            end: end
                        }
                );
            };
        }]); //AddBarController

    app.controller('EditBarController', ['$http', '$scope', '$log', "$location", "$anchorScroll", "$rootScope", "fileUpload", "$routeParams", "toaster", function($http, $scope, $log, $location, $anchorScroll, $rootScope, fileUpload, $routeParams, toaster) {
            $scope.hideminusbar = true;
            $scope.hideminushh = true;
            $scope.bar = {};
            $scope.barHours = [];
            $scope.hhHours = [];
            $scope.message;
            var open = new Date(2014, 1, 1, 11, 0, 0, 0);
            var close = new Date(2014, 1, 1, 3, 0, 0, 0);
            var start = new Date(2014, 1, 1, 16, 0, 0, 0);
            var end = new Date(2014, 1, 1, 19, 0, 0);
            var data = $routeParams.barName;
            $http.post('/php/getBar.php', data)
                    .success(function(response, status, headers, config)
                    {
                        if (response.success === 0) {
                            $scope.show = false;
                            console.log(response.message);
                        }
                        else
                        {
                            $scope.bar = response.bar;
                            console.log(response.message);
                            $scope.editBar();
                        }
                    })
                    .error(function(response, status, headers, config)
                    {
                        console.log(response.message);
                        $scope.show = false;
                    });
            $scope.editBar = function() {

                var dop;
                var dc;
                var ds;
                var de;
                var i;
                if ($scope.bar.Monday.isClosed === false)
                {
                    dop = new Date(Date.parse($scope.bar.Monday.open));
                    dc = new Date(Date.parse($scope.bar.Monday.close));
                    $scope.barHours.push({Monday: true, open: dop, close: dc});
                    if ($scope.bar.Monday.noHH !== true)
                    {
                        for (i = 0; i < $scope.bar.Monday.happyHour.length; i++)
                        {
                            ds = new Date(Date.parse($scope.bar.Monday.happyHour[i].start));
                            de = new Date(Date.parse($scope.bar.Monday.happyHour[i].end));
                            $scope.hhHours.push({Monday: true, start: ds, end: de});
                        }
                    }
                }
                if ($scope.bar.Tuesday.isClosed === false)
                {
                    dop = new Date(Date.parse($scope.bar.Tuesday.open));
                    dc = new Date(Date.parse($scope.bar.Tuesday.close));
                    $scope.barHours.push({Tuesday: true, open: dop, close: dc});
                    if ($scope.bar.Tuesday.noHH !== true)
                    {
                        for (i = 0; i < $scope.bar.Tuesday.happyHour.length; i++)
                        {
                            ds = new Date(Date.parse($scope.bar.Tuesday.happyHour[i].start));
                            de = new Date(Date.parse($scope.bar.Tuesday.happyHour[i].end));
                            $scope.hhHours.push({Tuesday: true, start: ds, end: de});
                        }
                    }
                }
                if ($scope.bar.Wednesday.isClosed === false)
                {
                    dop = new Date(Date.parse($scope.bar.Wednesday.open));
                    dc = new Date(Date.parse($scope.bar.Wednesday.close));
                    $scope.barHours.push({Wednesday: true, open: dop, close: dc});
                    if ($scope.bar.Wednesday.noHH !== true)
                    {
                        for (i = 0; i < $scope.bar.Wednesday.happyHour.length; i++)
                        {
                            ds = new Date(Date.parse($scope.bar.Wednesday.happyHour[i].start));
                            de = new Date(Date.parse($scope.bar.Wednesday.happyHour[i].end));
                            $scope.hhHours.push({Wednesday: true, start: ds, end: de});
                        }
                    }
                }
                if ($scope.bar.Thursday.isClosed === false)
                {
                    dop = new Date(Date.parse($scope.bar.Thursday.open));
                    dc = new Date(Date.parse($scope.bar.Thursday.close));
                    $scope.barHours.push({Thursday: true, open: dop, close: dc});
                    if ($scope.bar.Thursday.noHH !== true)
                    {
                        for (i = 0; i < $scope.bar.Thursday.happyHour.length; i++)
                        {
                            ds = new Date(Date.parse($scope.bar.Thursday.happyHour[i].start));
                            de = new Date(Date.parse($scope.bar.Thursday.happyHour[i].end));
                            $scope.hhHours.push({Thursday: true, start: ds, end: de});
                        }
                    }
                }
                if ($scope.bar.Friday.isClosed === false)
                {
                    dop = new Date(Date.parse($scope.bar.Friday.open));
                    dc = new Date(Date.parse($scope.bar.Friday.close));
                    $scope.barHours.push({Friday: true, open: dop, close: dc});
                    if ($scope.bar.Friday.noHH !== true)
                    {
                        for (i = 0; i < $scope.bar.Friday.happyHour.length; i++)
                        {
                            ds = new Date(Date.parse($scope.bar.Friday.happyHour[i].start));
                            de = new Date(Date.parse($scope.bar.Friday.happyHour[i].end));
                            $scope.hhHours.push({Friday: true, start: ds, end: de});
                        }
                    }
                }
                if ($scope.bar.Saturday.isClosed === false)
                {
                    dop = new Date(Date.parse($scope.bar.Saturday.open));
                    dc = new Date(Date.parse($scope.bar.Saturday.close));
                    $scope.barHours.push({Saturday: true, open: dop, close: dc});
                    if ($scope.bar.Saturday.noHH !== true)
                    {
                        for (i = 0; i < $scope.bar.Saturday.happyHour.length; i++)
                        {
                            ds = new Date(Date.parse($scope.bar.Saturday.happyHour[i].start));
                            de = new Date(Date.parse($scope.bar.Saturday.happyHour[i].end));
                            $scope.hhHours.push({Saturday: true, start: ds, end: de});
                        }
                    }
                }
                if ($scope.bar.Sunday.isClosed === false)
                {
                    dop = new Date(Date.parse($scope.bar.Sunday.open));
                    dc = new Date(Date.parse($scope.bar.Sunday.close));
                    $scope.barHours.push({Sunday: true, open: dop, close: dc});
                    if ($scope.bar.Sunday.noHH !== true)
                    {
                        for (i = 0; i < $scope.bar.Sunday.happyHour.length; i++)
                        {
                            ds = new Date(Date.parse($scope.bar.Sunday.happyHour[i].start));
                            de = new Date(Date.parse($scope.bar.Sunday.happyHour[i].end));
                            $scope.hhHours.push({Sunday: true, start: ds, end: de});
                        }
                    }
                }
                if ($scope.barHours.length === 1) {
                    $scope.hideminusbar = true;
                }
                else
                {
                    $scope.hideminusbar = false;
                }
                if ($scope.hhHours.length === 1) {
                    $scope.hideminushh = true;
                }
                else
                {
                    $scope.hideminushh = false;
                }

                var temp = "";
                for (i = 0; i < $scope.bar.atmosphere.length; i++) {
                    temp = temp.concat($scope.bar.atmosphere[i] + ", ");
                }
                temp = temp.substring(0, temp.length - 2);
                $scope.bar.atmosphere = temp;
                temp = "";
                for (i = 0; i < $scope.bar.type.length; i++) {
                    temp = temp.concat($scope.bar.type[i] + ", ");
                }
                temp = temp.substring(0, temp.length - 2);
                $scope.bar.type = temp;
                return true;
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
                $scope.addBaseBarHours();
            };
            $scope.removeBarHours = function(hours) {
                var index = $scope.barHours.indexOf(hours);
                if (index > -1)
                    $scope.barHours.splice(index, 1);
                if ($scope.barHours.length === 1)
                {
                    $scope.hideminusbar = true;
                }
            };
            $scope.removeHHHours = function(hours) {
                var index = $scope.hhHours.indexOf(hours);
                if (index > -1)
                    $scope.hhHours.splice(index, 1);
                if ($scope.hhHours.length === 1)
                {
                    $scope.hideminushh = true;
                }
            };
            $scope.addHHHours = function() {
                $scope.hideminushh = false;
                $scope.addBaseHHHours();
            };
            $scope.addHoursToBar = function()
            {
                $scope.bar.Monday = {isClosed: true, noHH: true};
                $scope.bar.Tuesday = {isClosed: true, noHH: true};
                $scope.bar.Wednesday = {isClosed: true, noHH: true};
                $scope.bar.Thursday = {isClosed: true, noHH: true};
                $scope.bar.Friday = {isClosed: true, noHH: true};
                $scope.bar.Saturday = {isClosed: true, noHH: true};
                $scope.bar.Sunday = {isClosed: true, noHH: true};
                var i;
                var j;
                for (i = 0; i < $scope.barHours.length; i++)
                {
                    if ($scope.barHours[i].Monday)
                    {
                        $scope.bar.Monday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Monday)
                            {
                                $scope.bar.Monday.noHH = false;
                                $scope.bar.Monday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Tuesday)
                    {
                        $scope.bar.Tuesday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Tuesday)
                            {
                                $scope.bar.Tuesday.noHH = false;
                                $scope.bar.Tuesday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Wednesday)
                    {
                        $scope.bar.Wednesday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Wednesday)
                            {
                                $scope.bar.Wednesday.noHH = false;
                                $scope.bar.Wednesday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Thursday)
                    {
                        $scope.bar.Thursday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Thursday)
                            {
                                $scope.bar.Thursday.noHH = false;
                                $scope.bar.Thursday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Friday)
                    {
                        $scope.bar.Friday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Friday)
                            {
                                $scope.bar.Friday.noHH = false;
                                $scope.bar.Friday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Saturday)
                    {
                        $scope.bar.Saturday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Saturday)
                            {
                                $scope.bar.Saturday.noHH = false;
                                $scope.bar.Saturday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                    if ($scope.barHours[i].Sunday)
                    {
                        $scope.bar.Sunday =
                                {
                                    isClosed: false,
                                    noHH: true,
                                    open: $scope.barHours[i].open,
                                    close: $scope.barHours[i].close,
                                    happyHour: []
                                };
                        for (j = 0; j < $scope.hhHours.length; j++)
                        {
                            if ($scope.hhHours[j].Sunday)
                            {
                                $scope.bar.Sunday.noHH = false;
                                $scope.bar.Sunday.happyHour.push({start: $scope.hhHours[j].start, end: $scope.hhHours[j].end});
                            }
                        }
                    }
                }
            };
            $scope.uploadFile = function(id) {
                var file = $scope.barThumb;
                console.info('file is ' + JSON.stringify(file));
                var uploadUrl = "/php/upload.php";
                fileUpload.uploadFileToUrl(file, uploadUrl, id);
            };
            $scope.pop = function(type, title, message) {
                toaster.pop(type, title, message);
            };

            $scope.addBar = function() {
                $scope.addHoursToBar();
                var atm = $scope.bar.atmosphere.split(",");
                console.info(atm);
                $scope.bar.atmosphere = [];
                var i;
                for (i = 0; i < atm.length; i++) {
                    $scope.bar.atmosphere.push(atm[i].toString().trim());
                }
                var type = $scope.bar.type.split(",");
                $scope.bar.type = [];
                for (i = 0; i < type.length; i++) {
                    $scope.bar.type.push(type[i].toString().trim());
                }

                if ($scope.barThumb) {
                    $scope.bar.thumb = $scope.barThumb.name;
                }
                $http.post('/php/editBar.php', $scope.bar)
                        .success(function(response, status, headers, config)
                        {
                            if (response.success === 0) {
                                $scope.pop('error', "Error!", response.message);
                            }
                            else if (response.success === 1) {
                                $scope.pop('success', "SUCCESS!", $scope.bar.name + " updated!");
                                $scope.uploadFile($scope.bar.id);
                            }
                            var temp = $scope.bar.name;
                            $scope.bar = {};
                            $scope.setBaseBarHours();
                            $scope.setBaseHHHours();
                            document.getElementById('photo').value = null;
                            console.log(status + ' - ' + response.message);
                            $location.url('/viewBar/' + temp);
                        })
                        .error(function(data, status)
                        {
                            $scope.pop('error', "Error!", "OOPS! Something went wrong!\n" + data);
                            console.log('error');
                        });
            };
            $scope.testData = function() {
                $scope.bar = {"price": "$", "name": "TestBar", "neighborhood": "TestNeighborhood", "atmosphere": "test1, test2, test3", "type": "test1, test2, test3", "street": "testStreet", "city": "testCity", "state": "testState", "zip": "testZip", "deal": "testDeal", "instagram": "testInsta"};
            };
            $scope.clear = function() {
                $scope.bar = {price: "$"};
                $scope.hideminusbar = true;
                $scope.hideminushh = true;
                $scope.setBaseBarHours();
                $scope.setBaseHHHours();
                document.getElementById('photo').value = null;
            };
            $scope.setBaseBarHours = function() {
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
                                open: open,
                                close: close
                            }
                        ];
            };
            $scope.setBaseHHHours = function() {
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
                                start: start,
                                end: end
                            }
                        ];
            };
            $scope.addBaseBarHours = function() {
                $scope.barHours.push(
                        {
                            Monday: true,
                            Tuesday: true,
                            Wednesday: true,
                            Thursday: true,
                            Friday: true,
                            Saturday: true,
                            Sunday: true,
                            open: open,
                            close: close
                        }
                );
            };
            $scope.addBaseHHHours = function() {

                $scope.hhHours.push(
                        {
                            Monday: true,
                            Tuesday: true,
                            Wednesday: true,
                            Thursday: true,
                            Friday: true,
                            Saturday: false,
                            Sunday: false,
                            start: start,
                            end: end
                        }
                );
            };
        }]); //EditBarConrtoller

    app.controller('ViewBarController', ['$scope', '$http', '$routeParams', '$location', 'toaster', '$rootScope', function($scope, $http, $routeParams, $location, toaster, $rootScope) {
            $scope.show = true;
            $scope.bar = {}
            $scope.isReadonly = false;            
            $scope.newReviews = {rating: 3, comment: "", timestamp: 0, user: ""}; 
            $scope.max = 5;
            $scope.noReviews=false;
            
            //Google$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
            
            $scope.pageSize = 10;
            $scope.currentPage = 1;
            
            var data = $routeParams.barName;
            
            $http.post('/php/getBar.php', data)
                    .success(function(response, status, headers, config)
                    {
                        if (response.success === 0) {
                            $scope.show = false;
                        }
                        else
                        {
                            $scope.bar = response.bar;
                            $scope.totalReviews = $scope.bar.reviews.length;
                            $scope.noReviews = ($scope.totalReviews == 0);
                            console.log(response.message);
                        }
                    })
                    .error(function(response, status, headers, config)
                    {
                        console.log(response.message);
                        $scope.show = false;
                    });
              
            /*GoogleMapApi.then(function(maps) {

        	});      
            */
            
			$scope.pop = function(type, title, message) {
                toaster.pop(type, title, message);
            };   
            
            $scope.removeReview = function(review){
            	var index = ($scope.currentPage - 1) * $scope.pageSize + review;
            	console.info(index);
            	$scope.bar.reviews.splice(index, 1);
            	$http.post('/php/editBar.php', $scope.bar)
                        .success(function(response, status, headers, config)
                        {
                            if (response.success === 0) {
                                $scope.pop('error', "Error!", "Failed to Remove, please try again");
                                
                            }
                            else if (response.success === 1) {
                                $scope.pop('success', "SUCCESS!", "Review removed!");
                                
                            }
                            
                        })
                        .error(function(data, status)
                        {
                            $scope.pop('error', "Error!", "OOPS! Something went wrong!\n" + data);
                            console.log('error');
                        });
            }         

            $scope.pageChangeHandler = function(num) {
                console.log('meals page changed to ' + num);
            };
            
            $scope.editBar = function(newBar) {
                var name = newBar.name;
                $location.url('/editBar/' + name);
            };

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            };
            
            $scope.addReview = function(){
            	$scope.newReviews.timestamp = Date.now();
            	$scope.newReviews.user = $rootScope.username;
                $scope.bar.reviews.unshift($scope.newReviews);
                $http.post('/php/editBar.php', $scope.bar)
                        .success(function(response, status, headers, config)
                        {
                            if (response.success === 0) {
                                $scope.pop('error', "Error!", "Review failed, please try again");
                                
                            }
                            else if (response.success === 1) {
                                $scope.pop('success', "SUCCESS!", "Review added!");
                                $scope.newReviews = {rating: 3, comment: "", timestamp: 0, user: $rootScope.username}; 
                            }
                            
                        })
                        .error(function(data, status)
                        {
                            $scope.pop('error', "Error!", "OOPS! Something went wrong!\n" + data);
                            console.log('error');
                        });
            };
            
        }]); //ViewBarController

    app.factory("Data", ['$http', 'toaster',
        function($http, toaster) { // This service connects to our REST API

            var serviceBase = 'php/v1/';
            var obj = {};
            obj.toast = function(data) {
                toaster.pop(data.status, "", data.message, 2000, 'trustedHtml');
            };
            obj.get = function(q) {
                return $http.get(serviceBase + q).then(function(results) {
                    return results.data;
                });
            };
            obj.post = function(q, object) {
                return $http.post(serviceBase + q, object).then(function(results) {
                    return results.data;
                });
            };
            obj.put = function(q, object) {
                return $http.put(serviceBase + q, object).then(function(results) {
                    return results.data;
                });
            };
            obj.delete = function(q) {
                return $http.delete(serviceBase + q).then(function(results) {
                    return results.data;
                });
            };
            return obj;
        }]);

    app.directive('fileModel', ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;
                    element.bind('change', function() {
                        scope.$apply(function() {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]);

    app.directive('focus', function() {
        return function(scope, element) {
            element[0].focus();
        };
    });

    app.directive('passwordMatch', [function() {
            return {
                restrict: 'A',
                scope: true,
                require: 'ngModel',
                link: function(scope, elem, attrs, control) {
                    var checker = function() {

                        //get the value of the first password
                        var e1 = scope.$eval(attrs.ngModel);
                        //get the value of the other password  
                        var e2 = scope.$eval(attrs.passwordMatch);
                        if (e2 != null)
                            return e1 == e2;
                    };
                    scope.$watch(checker, function(n) {

                        //set the form control to valid if both 
                        //passwords are the same, else invalid
                        control.$setValidity("passwordNoMatch", n);
                    });
                }
            };
        }]);

    app.service('fileUpload', ['$http', function($http) {
            this.uploadFileToUrl = function(file, uploadUrl, id) {
                var fd = new FormData();
                fd.append('file', file);
                console.log(id);
                fd.append('id', id);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                        .success(function(response, status, headers, config) {
                            if (response.success === 0) {
                                console.log("Error: " + response.message);
                            }
                            else {
                                console.log("Success: " + response.message);
                            }
                        })
                        .error(function() {
                            console.log("File ERROR");
                        });
            };
        }]);

    app.filter('tel', function() {
        return function(tel) {
            if (!tel) {
                return '';
            }

            var value = tel.toString().trim().replace(/^\+/, '');
            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;
            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;
                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;
                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;
                default:
                    return tel;
            }

            if (country === 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);
            return (country + " (" + city + ") " + number).trim();
        };
    });
})();
