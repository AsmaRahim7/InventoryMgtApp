var app = angular.module('inventory-app', []);

app.controller('ctrl-items', function ($scope) {
    $scope.Categories = []
    $scope.items = []
    $scope.item = { Name: '', CatName: '', Quantity: 0, isDeleted: false };
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
            $scope.loading = false;

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    }

    if (localStorage.getItem('item') !== null && localStorage.getItem('item') !== undefined) {
        $scope.item = JSON.parse(localStorage.getItem('item'));
    }

    $scope.add_item = function () {
        if (localStorage.getItem('item') !== null && localStorage.getItem('item') !== undefined) {
            let item = JSON.parse(localStorage.getItem('item'));
            firebase.database()
                .ref('items').child(item.ID)
                .update({ Name: $scope.item.Name, CatName: $scope.item.CatName, Quantity: $scope.item.Quantity }, function (error) {
                    if (error) alert(error);
                    else {
                        // do something
                        localStorage.removeItem('item');
                        location.href = "items.html";
                    }
                });
        }
        else {
            if ($scope.item.Category !== '' && $scope.item.Name !== '' && $scope.item.Quantity !== '') {
                if ($scope.items.find(x => x.Name === $scope.item.Name && x.CatName === $scope.item.CatName && x.Quantity === $scope.item.Quantity) === undefined) {

                    $scope.item.isDeleted = false

                    firebase.database().ref('items').push($scope.item
                        , function (error) {
                            if (error) alert(error);
                            else {
                                // do something
                                location.href = "items.html";
                            }
                        });
                }
                else {
                    alert('Alredy Exist');
                }
            }
        }
    }

    $scope.edit = function (item) {
        localStorage.setItem('item', JSON.stringify(item));
        location.href = "manage_item.html"
    }

    $scope.delete = function (item) {
        if (confirm('Are you sure?')) {
            var index = $scope.items.indexOf(item);
            $scope.items.splice(index, 1);
            localStorage.setItem('items', JSON.stringify($scope.items));

            firebase.database()
                .ref('items').child(item.ID)
                .update({ isDeleted: true }, function (error) {
                    if (error) alert(error);
                    else {
                        // do something
                        LoadItemList();
                    }
                });
        }
    }

    $scope.changeQuantity = function (option) {
        switch (option) {
            case '+':
                $scope.item.Quantity += 1;
                break;
            case '-':
                if ($scope.item.Quantity > 0) {
                    $scope.item.Quantity -= 1;
                }
                break;
        }
    }
});