var app = angular.module('inventory-app', []);

app.controller('ctrl-cateogry', function ($scope) {
    //alert('category controller')

    $scope.Categories = []
    $scope.Category = { ID: '', Name: '' };
    $scope.loading = false;

    LoadCategoryList()

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

    if (localStorage.getItem('category') !== null && localStorage.getItem('category') !== undefined) {
        $scope.Category = JSON.parse(localStorage.getItem('category'));
    }

    $scope.add_category = function () {
        if ($scope.Category.Name !== '') {
            if (localStorage.getItem('category') !== null && localStorage.getItem('category') !== undefined) {
                let cat = JSON.parse(localStorage.getItem('category'));
                firebase.database()
                    .ref('categories').child(cat.ID)
                    .set({ Name: $scope.Category.Name }, function (error) {
                        if (error) alert(error);
                        else {
                            // do something
                            localStorage.removeItem('category');
                            location.href = "category.html";
                        }
                    });
            }
            else {
                if ($scope.Categories.find(x => x.Name === $scope.Category.Name) === undefined) {

                    firebase.database().ref('categories').push({ Name: $scope.Category.Name }
, function (error) {
                        if (error) alert(error);
                        else {
                            // do something
                            location.href = "category.html";
                        }
                    });
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
            firebase.database()
                .ref('categories').child(cat.ID)
                .remove(function (error) {
                    if (error) alert(error);
                    else {
                        // do something
                        LoadCategoryList()
                    }
                });
        }
    }
});