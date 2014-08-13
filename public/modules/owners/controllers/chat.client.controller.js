'use strict';

angular.module('owners').controller('ChatController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$http', 'socket',
function($scope, $stateParams, $location, Authentication, Owners, $http, socket ) {
    $scope.init=function(){
        $scope.msgs=[];
        $scope.newMsg='';
        $scope.emitMsg={};
        $scope.authentication = Authentication;
        $scope.userName=$scope.authentication.user.displayName;        
    };
    $scope.init();
    
    /*****
    SOCKET TEST
    ****/
    $scope.sendMsg=function(){
        $scope.emitMsg.user=$scope.userName; 
        $scope.emitMsg.msg=$scope.newMsg;
        socket.emit('send msg', $scope.emitMsg);
        $scope.newMsg='';
    };
    
    socket.on('addChat', function(addMsg){
//        console.log(addMsg);
        $scope.msgs.push(addMsg);
        console.log($scope.msgs);
        $scope.$digest();
    });
    
	}
]);