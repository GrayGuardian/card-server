const Template = {};

let getArr = function (name) {
    return require("./" + name);
}

let getMap = function (name, key) {
    let map = {}
    let arr = getArr(name);
    arr.forEach(element => {
        if (element[key] != null) {
            map[element[key]] = element;
        }
        else {
            //未找到标识
        }

    });
    return map;
}

let template_card = getMap('template_card', "tid");
let template_skill_gem = getMap('template_skill_gem', "tid");

Template.template_card = template_card;
Template.template_skill_gem = template_skill_gem;

module.exports = Template;