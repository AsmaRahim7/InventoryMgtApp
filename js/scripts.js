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

// 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

app.controller('ctrl-home', function ($scope) {
    $scope.items = []
    $scope.filteredItems = [];
    $scope.Categories = []
    $scope.CatName = '';

    $scope.saveToServer = async function () {
        // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
        const octokit = new Octokit();
        
        octokit.auth({
            type: 'basic',
            username: 'asmamano7@gmail.com',
            password: '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'
        });

        // Save categories
        let resp = await octokit.request('PUT /repos/AsmaRahim7/InventoryMgtApp/contents/categories.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'categories.json',
            headers: {
                'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
            }
            message: 'Saved categories',
            committer: {
                name: 'Asma Rahim',
                email: 'asmamano7@gmail.com'
              },
            content: btoa(JSON.stringify($scope.Categories)),
            //sha: file.data.sha
        })

        //Save Items
        let file_items = await octokit.request('GET /repos/AsmaRahim7/InventoryMgtApp/contents/Items.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'Items.json',
        })

        resp = await octokit.request('PUT /repos/AsmaRahim7/InventoryMgtApp/contents/Items.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'Items.json',
            message: 'Saved Items',
            content: btoa(JSON.stringify($scope.items)),
            //sha: file_items.data.sha
        })

        alert('Your data has been saved to server.');
    }

    $scope.getFromServer = async function () {
        const octokit = new Octokit({ auth: `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` });

        let file_category = await octokit.request('GET /repos/AsmaRahim7/InventoryMgtApp/contents/categories.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'categories.json',
        })

        let file_items = await octokit.request('GET /repos/AsmaRahim7/InventoryMgtApp/contents/Items.json', {
            owner: 'AsmaRahim7',
            repo: 'InventoryMgtApp',
            path: 'Items.json',
        })

        $scope.items = JSON.parse(atob(file_items.data.content));
        $scope.Categories = JSON.parse(atob(file_category.data.content));

        localStorage.setItem('categories', JSON.stringify($scope.Categories));
        localStorage.setItem('items', JSON.stringify($scope.items));

        alert('Get from the server.')

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
