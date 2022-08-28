/*!
* Start Bootstrap - Bare v5.0.7 (https://startbootstrap.com/template/bare)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

var app = angular.module('inventory-app', []);

app.controller('ctrl-home', function ($scope) {
    $scope.items = []
    $scope.filteredItems = [];
    $scope.Categories = []
    $scope.CatName = '';
    $scope.loading = false;

    LoadCategoryList()
    LoadItemList()

    function LoadCategoryList() {
        var db = firebase.database().ref('categories');
        $scope.loading = true;
        db.on('value', function (categories) {
            //alert(categories);
            $scope.Categories = []
            categories.forEach(function (data) {
                $scope.Categories.push({ ID: data.key, Name: data.val().Name })
            });
            $scope.loading = false;

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    }
    function LoadItemList() {
        var db = firebase.database().ref('items');
        $scope.loading = true;
        db.on('value', function (items) {
            //alert(categories);
            $scope.items = []
            items.forEach(function (data) {
                if (data.val().isDeleted === false) {
                    $scope.items.push({ ID: data.key, Name: data.val().Name, CatName: data.val().CatName, Quantity: data.val().Quantity, isDeleted: data.val().isDeleted })
                }
            });
            $scope.filteredItems = $scope.items;
            $scope.loading = false;

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    }

    $scope.sortByCategory = function () {
        if ($scope.items.filter(x => x.CatName === $scope.CatName).length > 0) {
            $scope.filteredItems = $scope.items.filter(x => x.CatName === $scope.CatName);
        }
        else if ($scope.CatName === '') {
            $scope.filteredItems = $scope.items;
        }
        else {
            $scope.filteredItems = [];
        }
    }
});

