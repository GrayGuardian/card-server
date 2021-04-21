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
// 获取强化等级
Card.prototype.getEnchLv = async function () {
    return this.get_lv() % 10
}
// 获取进阶等级
Card.prototype.getAdvLv = async function () {
    return Math.floor(this.get_lv() / 10)
}

module.exports = Card