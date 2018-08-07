class Formula{
  constructor(){

  }

  get_value(){
    return 0;
  }
}


class Entity{
  constructor(id, title, is_positive, config){
    this.id = id;
    this.title = title;
    this.is_positive = is_positive;
    this.config = config || {};
    this.values = [];


    var default_value = this.config.default || 0;

    for (var i=0; i<12; i++)
      this.values[i] = default_value;
  }

  set_value(pos, value){
    this.values[pos] = Math.abs(value);
  }

  get_values(){
    var list = [];

    for (var i=0; i<12; i++)
      list[i] = this.values[i];

    return list;
  }
}

class Group{
  constructor(config){
    //TODO: Recreate using config
    this.entities={};
  }

  add_entry(id, title, is_positive, config){
    //TODO: check if already exists

    this.entities[id] = new Entity(id, title, is_positive, config);
    return this.entities[id];
  }

  add_incomming(id, title, config){
    return this.add_entry(id, title, true, config);
  }

  add_outcomming(id, title, config){
    return this.add_entry(id, title, false, config);
  }

  set_value(id, pos, value){
    console.log(id,pos,value);
    this.entities[id].set_value(pos, value);
  }

  get_incomming_entries(){
    var list=[];
    for (var i in this.entities){
      var entity = this.entities[i];
      if (entity.is_positive)
        list.push(entity);
    }
    return list;
  }

  get_outcomming_entries(){
    var list=[];
    for (var i in this.entities){
      var entity = this.entities[i];
      if (!entity.is_positive)
        list.push(entity);
    }
    return list;
  }

  get_balance_calc(){
    var list = [];

    for (var i=0; i<12; i++)
      list[i] = 0;

    this.get_incomming_entries().forEach(function(entry){
      var i=0;
      entry.get_values().forEach(function(value){
        list[i] += value;
        i++;
      })
    })

    this.get_outcomming_entries().forEach(function(entry){
      var i=0;
      entry.get_values().forEach(function(value){
        list[i] -= value;
        i++;
      })
    })

    return list;
  }

}

//--------------------------------------------------------------------------------------------------
