var app = angular.module('inventory-app', []);

app.controller('ctrl-items', function ($scope) {
    $scope.Categories = []
    $scope.items = []
    $scope.item = { Name: '', CatName: '', Quantity: 0 };

    if (localStorage.getItem('categories') !== null && localStorage.getItem('categories') !== undefined) {
        $scope.Categories = JSON.parse(localStorage.getItem('categories'));
    }

    if (localStorage.getItem('items') !== null && localStorage.getItem('items') !== undefined) {
        $scope.items = JSON.parse(localStorage.getItem('items'));
    }

    if (localStorage.getItem('item') !== null && localStorage.getItem('item') !== undefined) {
        $scope.item = JSON.parse(localStorage.getItem('item'));
    }


    $scope.add_item = function () {
        if (localStorage.getItem('item') !== null && localStorage.getItem('item') !== undefined) {
            let item = JSON.parse(localStorage.getItem('item'));
            let index = $scope.items.findIndex(x => x.Name === item.Name && x.CatName === item.CatName && x.Quantity === item.Quantity);

            $scope.items[index].Name = $scope.item.Name;
            $scope.items[index].CatName = $scope.item.CatName;
            $scope.items[index].Quantity = $scope.item.Quantity;

            localStorage.setItem('items', JSON.stringify($scope.items));
            localStorage.removeItem('item');
            location.href = "items.html";
        }
        else {
            if ($scope.item.Category !== '' && $scope.item.Name !== '' && $scope.item.Quantity !== '') {
                if ($scope.items.find(x => x.Name === $scope.item.Name && x.CatName === $scope.item.CatName && x.Quantity === $scope.item.Quantity) === undefined) {
                    $scope.items.push($scope.item);
                    localStorage.setItem('items', JSON.stringify($scope.items));
                    location.href = "items.html";
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