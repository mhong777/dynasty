////    <tr ng-repeat="owner in owners" ng-click="open(owner.ownerIndex)">
//    /*FOR MODAL*/
//    $scope.openModal=function(selectedOwner){
//        $scope.selectedOwner=selectedOwner;
//        $scope.open();
//    };
//    
//    $scope.open = function (selectedOwner) {
//        console.log(selectedOwner);
//        var modalInstance = $modal.open({
//          templateUrl: '/views/modal.html',
//          controller: reviewRoster,
//          size: 'lg',
//          resolve: {
//            items: function () {
//              return selectedOwner;
//            }
//          }
//        });
//
//        modalInstance.result.then(function (selectedItem) {
//              $scope.selected = selectedItem;
//            }, function () {
//              $log.info('Modal dismissed at: ' + new Date());
//        });
//    };
//    
//    
//
//    /*EXECUTE INIT*/
//    $scope.init();
//}
///*##################
//END CONTROLLER 
//###################*/
//
//angular.module('reviewRoster').controller('OwnersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$modalInstance', 'items',
//	function($scope, $stateParams, $location, Authentication, Owners, $modalInstance, items ) {
//		$scope.authentication = Authentication;
//	}
//]);
//var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
//
//  $scope.selectedOwner = items;
//
//  $scope.cancel = function () {
//    $modalInstance.dismiss('cancel');
//  };
//};
//
//
//
//
//
///*CONTROLLER FOR MODAL WINDOW*/
//function reviewRoster($scope, $modalInstance, items){
//    /*SET INIT FUNCTION*/
//    $scope.initRoster=function(){
//        
//        $scope.players=nflPlayers;
//        $scope.owners=teamOwners;      
//        $scope.positionTypes=positionPlayers;
//        
//        $scope.ownerId=items;
//        $scope.owner=teamOwners[$scope.ownerId];
//        $scope.paidPlayers=[];
//        $scope.cutPlayers=[];
//        $scope.myPlayers=[];
//        $scope.makeRoster();
//        
//    }
//    
//    //FUNCTION TO INITIALIZE ROSTERS
//    $scope.makeRoster=function(){
//        angular.forEach($scope.owner.paidPlayer, function(position){
//           angular.forEach(position.roster, function(player){
//              $scope.myPlayers.push($scope.players[player]); 
//           }); 
//        });
//    };
//
////        angular.forEach($scope.owners, function(owner){
////           angular.forEach($scope.roster, function(spot){
////               owner.positionRoster[spot.index]="n/a";
////           }); 
////        });
//    
//    
//    //FUNCTION FOR CHECKING USER
//    $scope.checkUser=function(checkedUserId){
//        if(checkedUserId===$scope.ownerId){
//            return true;
//        }
//        else{return false;}
//    }
//    
//    //FUNCTION FOR CHECKBOX TO CUT PLAYER
//    $scope.cutPlayer=function(ownerId, playerId, positionId){
//        //find index and remove player
//        var rosterSpot = $scope.owners[ownerId].paidPlayer[positionId].roster.indexOf(playerId);
//        $scope.owners[ownerId].paidPlayer[positionId].roster.splice(rosterSpot,1);
//        $scope.owners[ownerId].totalPlayers--;
//        $scope.owners[ownerId].totalCap-=$scope.players[playerId].price;
//        //put player on cut list
//        $scope.owners[ownerId].cutPlayer.push(playerId);
//        $scope.players[playerId].unavailable=false;
//        //remove his salary from cap
//    }
//    
//    //FUNCTION FOR CHECKBOX TO PAY PLAYER
//    $scope.payPlayer=function(ownerId, playerId){
//        //find position index
//        var positionIndex,
//            positionName;
//        positionName=$scope.players[playerId].position;
//        for(i=0;i<$scope.positionTypes.length;i++){
//            if(positionName==$scope.positionTypes[i].name){
//                positionIndex=$scope.positionTypes[i].index;
//                break;
//            }
//        }
//        //find index and remove player from the cut list
//        var rosterSpot = $scope.owners[ownerId].cutPlayer.indexOf(playerId);
//        $scope.owners[ownerId].cutPlayer.splice(rosterSpot,1);
//        //add player to roster
//        $scope.owners[ownerId].paidPlayer[positionIndex].roster.push(playerId);
//        //add his salary from cap        
//        $scope.owners[ownerId].totalPlayers++;
//        $scope.owners[ownerId].totalCap+=$scope.players[playerId].price;
//        $scope.players[playerId].available=false;
//    }
//
//    $scope.cancel = function () {
//        $modalInstance.dismiss('cancel');
//    };
//    
//    $scope.initRoster();
//}