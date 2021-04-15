const Base = require('./base');

Base.inherits(this, Player, Base);

function Player(pid) {
    this.pid = pid;

    this.clsName = "Player"
    this.db_table = 'player_info';
    this.db_idxField = 'pid';
    this.db_fields = ["pid", 'uid', 'aid', "avatarid", 'name', 'lv', 'exp', 'vipLv', 'vipExp', "phone", "createTime", "loginTime", "logoutTime", "online"];
}
Player.create = async function (pid, idx) {
    let model = new Player(pid);
    await model.init(idx);
    return model;
}
Player.prototype.inited = async function () {
    this.currency = await PlayerCurrency.create(this.pid, this.idx)
}
Player.prototype.loadDataed = async function () {
    this.currency.loadData();
}


module.exports = Player