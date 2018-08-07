class BalanceController extends View{
  constructor(){
    super("balance");

    var group = new Group();
    group.add_incomming("alquiler","Alquiler",{default:500});
    var escalera = group.add_outcomming("escalera","Escalera");
    escalera.set_value(0, 250);
    escalera.set_value(3, 250);
    escalera.set_value(6, 250);
    escalera.set_value(9, 250);

    var seguro = group.add_outcomming("seguro","Seguro").set_value(11, 600);

    this.model = group;
    this.update = 0;
  }

  add_column(){
    var id = "test"
    var title = "test"
    var is_positive = true;

    this.model.add_entry(id, title, is_positive, {});
    this.update++;
  }
}
