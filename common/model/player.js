const Base = require('./base');

Base.inherits(this, Player, Base);

const PlayerCurrency = require('./player_currency');
const Card = require("./card");
const SkillGem = require("./skillgem");
const TAB = [
    { name: "currency", cls: PlayerCurrency, isArray: false },
    { name: "card", cls: Card, isArray: true },
    { name: "skillGem", cls: SkillGem, isArray: true }
]

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
    for (const key in TAB) {
        const info = TAB[key];
        let model = new info.cls(this.pid);
        let rows = await mysql.queryAsync(`SELECT * FROM ${model.db_table} WHERE pid = ?`, [this.pid]);
        if (info.isArray) {
            this[`${info.name}Map`] = {};
            for (const index in rows) {
                const row = rows[index];
                model = new info.cls(this.pid);
                model.loadData(row);
                await model.init(row[model.db_idxField]);
                this[`${info.name}Map`][row[model.db_idxField]] = model;
            }
        }
        else {
            if (rows.length > 0) {
                model.loadData(rows[0]);
                await model.init(rows[0][model.db_idxField]);
                this[info.name] = model;
            }
            else {
                // 不存在数据
            }
        }
    }

}
Player.prototype.loadDataed = async function () {
    for (const key in TAB) {
        const info = TAB[key];
        if (info.isArray) {
            for (var idx in this[`${info.name}Map`]) {
                this[`${info.name}Map`][idx].loadData();
            }
        }
        else {
            if (this[info.name] != null) {
                this[info.name].loadData();
            }
        }
    }
}
// 同步所有数据至客户端
Player.prototype.upAllClientData = function () {
    this.upClientData();
    for (const key in TAB) {
        const info = TAB[key];
        if (info.isArray) {
            for (var idx in this[`${info.name}Map`]) {
                this[`${info.name}Map`][idx].upClientData();
            }
        }
        else {
            if (this[info.name] != null) {
                this[info.name].upClientData();
            }
        }
    }
}

// 获得下级所需经验
Player.prototype.getNextLvExp = function (lv) {
    lv = lv == null ? this.get_lv() : lv;
    let exp = 30 * (Math.pow(lv, 3) + lv * 5) - 80
    return exp
}

module.exports = Player