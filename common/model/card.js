const Base = require('./base');

Base.inherits(this, Card, Base);

function Card(pid) {
    this.pid = pid;

    this.clsName = "Card"
    this.db_table = 'card_info';
    this.db_idxField = 'cid';
    this.db_fields = ["cid", "pid", "tid", "lv"];
}
Card.create = async function (pid, idx) {
    let model = new Card(pid);
    await model.init(idx);
    return model;
}
Card.prototype.inited = async function () {

}
Card.prototype.loadDataed = async function () {

}
module.exports = Card