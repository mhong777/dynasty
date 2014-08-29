'use strict';

angular.module('owners').controller('FinalViewController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$http', 'socket', 'Bids', 'Histories',
function($scope, $stateParams, $location, Authentication, Owners, $http, socket, Bids, Histories ) {
    $scope.init=function(){
        /*******
        INITIALIZE VALUES
        ******/        
        $scope.authentication = Authentication;
        $scope.history=[];
        
                
        /******
        GET ALL DATA
        ******/
		// Find a list of Owners
        $http.get('/draftList').
            success(function(data, status){
                $scope.owners=data;
                //get the end rank of the selected owner - for sorting
                $scope.endRank=function(selectedOwner){
                  return selectedOwner.rank[0];  
                };            
                for(var x=0; x<data.length;x++){
                    $scope.owners[x].selected=false;
                    $scope.owners[x].selectIndex=x;
                }
                for(var y=0; y<data.length;y++){
//                    console.log($scope.owners[y]._id);
                    if($scope.owners[y]._id==='53b9dac03391bfbf8a2e3e28'){
//                        console.log('works');
                        $scope.owners[y].selected=true;
                        $scope.displayOwner=$scope.owners[y]; 
                        $scope.selectedOwner=y;
                        break;
                    }
                }                
                
                
            });                   
  		// Find History
        $scope.checkId='';
        $http.get('/histories').
            success(function(data, status){
                for(var x=0; x<data.length;x++){
                    if(data[x].player._id!==$scope.checkId){
                        $scope.history.push(data[x]);
                        $scope.checkId=data[x].player._id;                        
//                        console.log($scope.checkId);
                    }
                }
//                console.log(data);
//                $scope.history=data;
            });  
    };//end initi function
    $scope.init();



    
    $scope.changeUser=function(owner){
        $scope.displayOwner=owner;  
        $scope.owners[owner.selectIndex].selected=true;
        $scope.owners[$scope.selectedOwner].selected=false;
        $scope.selectedOwner=owner.selectIndex;
        console.log($scope.selectedOwner);
    }; 
    
    /*******
    FOR SORTING
    ******/ 
    
    $scope.ownerPositionList=function(position){
        if(position.name==='QB'){
            return 1;
        }
        else if(position.name==='WR'){
            return 2;
        }
        else if(position.name==='RB'){
            return 3;
        }
        else if(position.name==='TE'){
            return 4;
        }
        else if(position.name==='K'){
            return 5;
        }
        else{
            return 6;
        }
    };    

   



    
    
    
	}
]);