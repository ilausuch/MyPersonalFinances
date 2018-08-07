var app = angular.module('myApp', ["finance.hansontable"]);
var mc;
var fs = require('fs');
/*
fs.writeFile("test2.json", "a", function (err) {
    if(err){
        alert("An error ocurred creating the file "+ err.message)
    }

    alert("The file has been succesfully saved");
});
*/
/*
fs.readFile("test.json", 'utf-8', function(err, data){
  console.log(data);
})
*/




app.controller('MainController', function($rootScope,$scope,$timeout,$http,$q) {
  mc = this;
  this.$rootScope=$rootScope;
  this.$scope=$scope;
  this.$timeout=$timeout;
  this.$http=$http;
  this.$q=$q;

  this.init = function(){
    this.$c = new BalanceController();
  }

  $timeout(function(){
    mc.init();
  })

});


function oneChange(changes){
  if (changes==null || changes==undefined)
    return undefined

  return {row:changes[0], col:changes[1], old_value:changes[2], value:changes[3]};
}
function prepare_changes(changes){
  if (changes==null || changes==undefined)
    return [];

  var list = [];
  for (i in changes){
    list.push(oneChange(changes[i]));
  }
  return list;
}
