/*!
* Start Bootstrap - Bare v5.0.7 (https://startbootstrap.com/template/bare)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

var app = angular.module('inventory-app', []);
var map;

//localStorage.removeItem('items');
//localStorage.removeItem('categories');
//localStorage.removeItem('item');
//localStorage.removeItem('category');


app.controller('ctrl-home', function ($scope) {
    $scope.items = []
    $scope.filteredItems = [];
    $scope.Categories = []
    $scope.CatName = '';

    $scope.saveToServer = async function () {
        // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
        const octokit = new Octokit({ auth: `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` });

        // Save categories
        // Get Json file
        let file = await octokit.request('GET /repos/AsmaRahim7/InventoryMgtApp/contents/categories.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'PATH',
        })

        let resp = await octokit.request('PUT /repos/AsmaRahim7/InventoryMgtApp/contents/categories.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'PATH',
            message: 'Saved categories',
            content: btoa(JSON.stringify($scope.Categories)),
            sha: file.data.sha
        })

        //Save Items
        let file_items = await octokit.request('GET /repos/AsmaRahim7/InventoryMgtApp/contents/Items.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'PATH',
        })

        resp = await octokit.request('PUT /repos/AsmaRahim7/InventoryMgtApp/contents/Items.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'PATH',
            message: 'Saved Items',
            content: btoa(JSON.stringify($scope.items)),
            sha: file_items.data.sha
        })

        alert('Your data has been saved to server.');
    }

    $scope.getFromServer = async function () {
        const octokit = new Octokit({ auth: `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` });

        let file_category = await octokit.request('GET /repos/AsmaRahim7/InventoryMgtApp/contents/categories.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'PATH',
        })

        let file_items = await octokit.request('GET /repos/AsmaRahim7/InventoryMgtApp/contents/Items.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'PATH',
        })

        $scope.items = JSON.parse(atob(file_items.data.content));
        $scope.Categories = JSON.parse(atob(file_category.data.content));

        localStorage.setItem('categories', JSON.stringify($scope.Categories));
        localStorage.setItem('items', JSON.stringify($scope.items));

        //location.href = 'index.html';
    }

    //$scope.getFromServer();

    if (localStorage.getItem('items') !== null && localStorage.getItem('items') !== undefined) {
        $scope.items = JSON.parse(localStorage.getItem('items'));
        $scope.filteredItems = JSON.parse(localStorage.getItem('items'));
    }

    if (localStorage.getItem('categories') !== null && localStorage.getItem('categories') !== undefined) {
        $scope.Categories = JSON.parse(localStorage.getItem('categories'));
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