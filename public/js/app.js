var myapp = angular.module('myApp', ['ngRoute'])
myapp.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
        })

        .when('/registration', {
            templateUrl: 'pages/registration.html',
            controller: 'registrationController'
        })

        .when('/logout', {
            templateUrl: 'pages/logout.html',
            controller: 'logoutController'
        })

        .when('/postjob', {
            templateUrl: 'pages/postjob.html',
            controller: 'postjobController',
            resolve:['optim', function(optim){
                return optim.loggedIn();
            }]
        })
        .when('/home',{
            templateUrl: 'pages/home.html',
            controller: 'homeController',
            resolve:['optim', function(optim){
                return optim.loggedIn();
            }]
        })

        .when('/searchjob', {
            templateUrl: 'pages/searchjob.html',
            controller: 'searchjobController',
            resolve:['optim', function(optim){
                return optim.loggedIn();
            }]
        })

});

myapp.factory("optim",['$location', '$http', '$rootScope', function($location, $http, $rootScope){
    return {
        
        loggedIn: function(){
            $http.get('/loggedIn').then(function(data){
                if(data.data){
                    $rootScope.user = data.data
                    console.log(data)
                    return true
                }
                else{
                    $location.path('/')
                    return false
                }
                })
        }
    }
}])

myapp.controller('registrationController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.username = ''
    $scope.password = ''
    $scope.email = ''
    $scope.phone = ''
    $scope.location = ''
    $scope.radiovalue = ''
    $scope.signup = function () {
        var registerNow = {
            "Username": $scope.username,
            "Password": $scope.password,
            "Email": $scope.email,
            "Phone": $scope.phone,
            "Location": $scope.location,
            "RadioValue": $scope.radiovalue
        }
        $http.post('/register', registerNow).then(function (e) {
            if (e.data.flag == "success") {
                $location.path('/')
            }
        })
    }
}]);


myapp.controller('loginController', ['$scope', '$http', '$location', function ($scope, $http, $location, $rootScope) {

    $scope.username = '',
        $scope.password = ''
    $scope.login = function () {
        var authenticate = {
            "Username": $scope.username,
            "Password": $scope.password
        }
        $http.post('/login', authenticate).then(function (e) {
            if (e.data.flag == "success") {
                //console.log('hi)
           
                $location.path('/home')
            }
        })
    }
}]);

myapp.controller('homeController', ['$scope', '$http', function ($scope, $http) {

    $scope.jobs = ""
    $http.get('/postjob').then(function (data) {
//console.log(data)
//console.log(data.data)
        $scope.jobs = data.data
    })

}]);

myapp.controller('postjobController', ['$scope', '$http', '$location', function ($scope, $http, $location, $rootScope) {

            $scope.title = ""
            $scope.description = ""
            $scope.keywords = ''
            $scope.location = ""

            $scope.post = function () {
                var postjob = {
                    "title": $scope.title,
                    "description": $scope.description,
                    "keywords": $scope.keywords.split(','),
                    "location": $scope.location
                }
                $http.post('/postjob', postjob).then(function (e) {
                    if (e.data.flag == "success") {
                        $location.path('/home')
                    }
                })
            }
       
}]);

myapp.controller('searchjobController', ['$scope','$http', function($scope, $http){
    $scope.searchTitle= "";
    $scope.searchDesc = "";
    $scope.searchKey = "";
    $scope.searchLoc= "";
   $scope.searchArr = [];
   $scope.go = function(){
       
       var searchTitle=  $scope.searchTitle ||"0"
        searchDesc= $scope.searchDesc || "0"
        searchKey = $scope.searchkey || "0"
         searchLoc = $scope.searchLoc || "0"
   
    
       $http.get('/postjob/'+searchTitle+'/'+searchDesc+'/'+searchKey+'/'+searchLoc).then(function(data){
         if(data.data){
             $scope.searchArr = data.data
         }

       })
    }

}])

myapp.controller('logoutController', ['$scope', '$location', '$http', '$rootScope', function ($scope, $location, $http, $rootScope) {
   if($rootScope.user != null){
       
       $http.post('/logout').then(function(data){
           if(data.data.flag=='success'){
               $rootScope.user = null
               $location.path('/')
            }
        })
    }
    else{
        $location.path('/')
    }
}])




