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

// let template_role = getMap('template_role', "id");
// let template_mount = getMap('template_mount', "id");
// let template_map = getMap('template_map', "id");

// Template.template_role = template_role;
// Template.template_mount = template_mount;
// Template.template_map = template_map;

module.exports = Template;