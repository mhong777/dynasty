'use strict';

angular.module('myFilters', []).
filter('byselection', function () {
    return function (players, selection) {
//        var items = {
//            genres: genres,
//            out: []
//        };
//        angular.forEach(movies, function (value, key) {
//            if (this.genres[value.genre] === true) {
//                this.out.push(value);
//            }
//        }, items);
        //return items.out;
    };
});