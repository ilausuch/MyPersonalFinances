var positiveRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.backgroundColor = '#CCFB5D';
  td.style["text-align"] = "right";
  if (value == 0)
    td.innerHTML = "";
  else
    if (value!==null)
      td.innerHTML="" + value + " &euro;"
};
var negativeRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.backgroundColor = '#eda7a5';
  td.style["text-align"] = "right";
  if (value == 0)
    td.innerHTML = "";
  else
    if (value!==null)
      td.innerHTML="" + value + " &euro;"

  //td.style.color="white"
};
var dateRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.backgroundColor = '#D1D0CE';
  td.style["text-align"] = "left";

  return td;
};
var balanceRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.backgroundColor = '#D1D0CE';
  td.style["text-align"] = "right";
  if (value == 0)
    td.innerHTML = "";
  else
    if (value!==null){
      td.innerHTML="" + value + " &euro;"
      if (value < 0)
        td.style.color = 'red';
      else
        td.style.color = 'white';
    }
  return td;
};
var accumRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.backgroundColor = '#B6B6B4';
  td.style["text-align"] = "right";
  if (value == 0)
    td.innerHTML = "";
  else
    if (value!==null){
      td.innerHTML="" + value + " &euro;"
      if (value < 0)
        td.style.color = 'red';
      else
        td.style.color = 'black';
    }
  return td;
};
var totalRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.backgroundColor = 'rgb(220, 205, 226)';
  td.style["text-align"] = "right";
  if (value == 0)
    td.innerHTML = "";
  else
    if (value!==null){
      td.innerHTML="" + value + " &euro;"
      if (value < 0)
        td.style.color = 'red';
      else
        td.style.color = 'blue';
    }
  return td;
};



class Handsontable_group{
  constructor(group, container_name){
    this.group = group;
    var container = document.getElementById(container_name);

    this.months=["Enero","Febrero","Marzo",
              "Abril","Mayo","Junio",
              "Julio","Agosto","Septiembre",
              "Octubre","Noviembre","Diciembre","TOTAL"];

    this.headers = [];
    this.columns = [];
    this.data = [];

    this.update();

    var $this = this;

    var view = new Handsontable(container, {
      data: this.data,
      //rowHeaders: this.months,
      rowHeaders: true,
      colHeaders: this.headers,
      columns: this.columns,
      //rowHeaderWidth: 100,
      filters: false,
      dropdownMenu: false,
      stretchH: 'none',
      beforeChange: function (changes, source) {
        switch(source){
          case "edit":
            return $this.edit_values(changes);
          break;
        }
      }
    });

    view.updateSettings({
      cells: function (row, col, prop) {
        var cellProperties = {};

        if ((row+1)%13 === 0) {
          cellProperties.editor = false;
          cellProperties.renderer = totalRenderer;
        } else {
          cellProperties.editor = 'text';
        }

        return cellProperties;
      }
    })

    this.view = view;
  }

  edit_values(changes){
    var $this = this;

    console.log(changes);

    var error = false;
    changes.forEach(function(change, i){
      if (Number(change[3]) != change[3])
        error = true;
    })

    if (error)
      return false;


    changes.forEach(function(change, i){
      $this.group.set_value(change[1],change[0],Number(change[3]));
    })

    this.update();
    return true;
  }

  refresh(){
    this.update();

    this.view.updateSettings({
      columns: this.columns,
      data: this.data,
      colHeaders: this.headers
    })

    var $this = this;
    setTimeout(function(){
      $this.view.render();
    });

  }

  update(){
    this.headers.splice(0,this.headers.length)
    this.columns.splice(0,this.columns.length)
    this.data.splice(0,this.data.length)

    var headers = this.headers
    var columns = this.columns
    var data = this.data

    var months=["Enero","Febrero","Marzo",
                "Abril","Mayo","Junio",
                "Julio","Agosto","Septiembre",
                "Octubre","Noviembre","Diciembre","TOTAL"];


    //[{label: ''}, {label: 'January', colspan: 3}, {label: 'February', colspan:3}],
            

    var accum = 0
    var i=0;
    this.group.get_balance_calc().forEach(function(balance_value){
      accum += balance_value;
      data.push({_b: balance_value, _a: accum, _y:2018, _m: months[i]});
      i++;
    })
    data.push({_b: "", _a: accum});



    var incomming = this.group.get_incomming_entries();
    var outcomming = this.group.get_outcomming_entries();

    headers.push("Year");
    columns.push({data:"_y", readOnly: true, renderer: dateRenderer});

    headers.push("months");
    columns.push({data:"_m", readOnly: true, renderer: dateRenderer});

    headers.push("Acum");
    columns.push({data:"_a", readOnly: true, renderer: accumRenderer});

    headers.push("Balance");
    columns.push({data:"_b", readOnly: true, renderer: balanceRenderer});


    incomming.forEach(function(entry){
      headers.push(entry.title);
      columns.push({
        data: entry.id,
        renderer: positiveRenderer
      })

      var i = 0;
      var accum = 0;
      entry.get_values().forEach(function(value){
        data[i][entry.id] = value;
        accum += value;
        i++;
      })

      data[i][entry.id] = accum;
    })



    outcomming.forEach(function(entry){
      headers.push(entry.title);
      columns.push({
        data: entry.id,
        renderer: negativeRenderer
      })
      var i = 0;
      var accum = 0;
      entry.get_values().forEach(function(value){
        data[i][entry.id] = value;
        accum += value;
        i++;
      })

      data[i][entry.id] = accum;
    })


    console.log(this);
    console.log(headers);
    console.log(columns);
    console.log(data);
  }
}

angular.module("finance.hansontable", [])
.directive('hsgroup', function() {
  var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
    $scope.id="hsgroup_"+Math.floor(Math.random()*1000);

    $timeout(function () {
      $scope.table = new Handsontable_group($scope.group, $scope.id);
    }, 10);

    $scope.$watch("update",function(){
      if ($scope.table)
        $scope.table.refresh();
    })
  }];

  template='<div id="{{id}}"></div>';

  return {
    restrict: 'E',
    scope: {
      group: '=',
      update: "="
    },
    controller: controller,
    template:template
  };
  });
