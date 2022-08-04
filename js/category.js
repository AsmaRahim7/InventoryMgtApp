var app = angular.module('inventory-app', []);

app.controller('ctrl-cateogry', function ($scope) {
    //alert('category controller')

    $scope.Categories = []
    $scope.Category = { Name: '' };

    if (localStorage.getItem('categories') !== null && localStorage.getItem('categories') !== undefined) {
        $scope.Categories = JSON.parse(localStorage.getItem('categories'));
    }

    if (localStorage.getItem('category') !== null && localStorage.getItem('category') !== undefined) {
        $scope.Category = JSON.parse(localStorage.getItem('category'));
    }

    $scope.add_category = function () {
        if ($scope.Category.Name !== '') {
            if (localStorage.getItem('category') !== null && localStorage.getItem('category') !== undefined) {
                let cat = JSON.parse(localStorage.getItem('category'));
                let index = $scope.Categories.findIndex(x => x.Name === cat.Name);
                $scope.Categories[index].Name = $scope.Category.Name;
                localStorage.setItem('categories', JSON.stringify($scope.Categories));
                localStorage.removeItem('category');
                location.href = "category.html";
            }
            else {
                if ($scope.Categories.find(x => x.Name === $scope.Category.Name) === undefined) {
                    $scope.Categories.push($scope.Category);
                    localStorage.setItem('categories', JSON.stringify($scope.Categories));
                    location.href = "category.html";
                }
                else {
                    alert('Alredy Exist');
                }
            }
        }
    }

    $scope.edit_cat = function (cat) {
        localStorage.setItem('category', JSON.stringify(cat));
        location.href = "manage_category.html"
    }

    $scope.delete_cat = function (cat) {
        if (confirm('Are you sure?')) {
            var index = $scope.Categories.indexOf(cat);
            $scope.Categories.splice(index, 1);
            localStorage.setItem('categories', JSON.stringify($scope.Categories));
        }
    }
});