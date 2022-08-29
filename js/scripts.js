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
    ////////////////////////////////////////////////////////////////////
    $scope.exportData = function () {
        fetch('https://expensedb-7c04f-default-rtdb.firebaseio.com/.json')
            .then((response) => response.json())
            .then((data) => {
                //let a = document.createElement("a");
                //a.download = `${getFormattedTime()}.json`;
                //a.href = 'https://expensedb-7c04f-default-rtdb.firebaseio.com/.json';
                //document.body.appendChild(a);
                //a.click();

                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
                element.setAttribute('download', `${getFormattedTime()}.json`);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            })
        
        //console.log(getFormattedTime())
    }

    function getFormattedTime() {
        var today = new Date();
        var y = today.getFullYear();
        // JavaScript months are 0-based.
        var m = today.getMonth() + 1;
        var d = today.getDate();
        var h = today.getHours();
        var mi = today.getMinutes();
        var s = today.getSeconds();
        return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
    }
});

