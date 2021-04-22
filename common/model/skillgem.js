const Base = require('./base');

Base.inherits(this, SkillGem, Base);

function SkillGem(pid) {
    this.pid = pid;

    this.clsName = "SkillGem"
    this.db_table = 'skillgem_info';
    this.db_idxField = 'skid';
    this.db_fields = ["skid", "pid", "tid", "color", "inlay"];
}
SkillGem.create = async function (pid, idx) {
    let model = new SkillGem(pid);
    await model.init(idx);
    return model;
}
SkillGem.prototype.inited = async function () {

}
SkillGem.prototype.loadDataed = async function () {

}

module.exports = SkillGem