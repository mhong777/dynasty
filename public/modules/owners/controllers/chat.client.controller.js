'use strict';

angular.module('owners').controller('ChatController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$http', 'socket',
function($scope, $stateParams, $location, Authentication, Owners, $http, socket ) {
    /*****
    SOCKET TEST
    ****/
    $scope.sendMsg=function(){
        socket.emit('send msg', 'works');
    };
    
	}
]);