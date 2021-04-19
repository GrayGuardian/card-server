const Base = require('./base');

Base.inherits(this, Player, Base);

function Player(pid) {
    this.pid = pid;

    this.clsName = "Player"
    this.db_table = 'player_info';
    this.db_idxField = 'pid';
    this.db_fields = ["pid", 'uid', 'aid', "avatarid", 'name', 'lv', 'exp',
        'vipLv', 'vipExp', 'vitValue', 'vitMax', 'vigValue', 'vigMax',
        "phone", "createTime", "loginTime", "logoutTime", "online"];
}
Player.create = async function (pid, idx) {
    let model = new Player(pid);
    await model.init(idx);
    return model;
}
Player.prototype.inited = async function () {
    this.currency = null;
    this.cardMap = {};

    // 人物货币
    this.currency = await PlayerCurrency.create(this.pid, this.idx)
    // 卡牌
    let cardInfos = await mysql.queryAsync("SELECT * FROM card_info WHERE pid = ?", [this.pid]);
    for (let index = 0; index < cardInfos.length; index++) {
        const info = cardInfos[index];
        let model = new Card(this.pid);
        model.loadData(info);
        await model.init(info.cid);
        // console.log("卡牌>>>", model.baseInfo);
        this.cardMap[info.cid] = model;
    }

}
Player.prototype.loadDataed = async function () {
    // 人物货币
    this.currency.loadData();
    // 卡牌
    this.cardMap.forEach(card => {
        card.loadData();
    });
}
// 获得下级所需经验
Player.prototype.getNextLvExp = function (lv) {
    lv = lv == null ? this.get_lv() : lv;
    let exp = 30 * (Math.pow(lv, 3) + lv * 5) - 80
    return exp
}

module.exports = Player