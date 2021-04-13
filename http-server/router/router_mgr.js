
var RouterMgr = function () { };

RouterMgr.prototype.login = async function (ctx, next) {
    let param = ctx.request.body;
    let username = param.username;
    let password = param.password;
    let user = await logic_mgr.login(username, util.md5(password));
    if (user.code > SUCCESS_CODE) {
        ctx.method.genError(user.code);
        return;
    }
    let areas = await logic_mgr.getAreaInfoList();
    let area = areas[0];
    if (user.lastAid != null) {
        areas.forEach(element => {
            if (user.lastAid == element.aid)
                area = element;
        });
    }
    let data = { info: user };
    data.token = util.token.encrypt({ uid: user.uid });
    data.areas = areas;
    data.area = area;
    ctx.response.body = data;
    await next();
}

RouterMgr.prototype.register = async function (ctx, next) {
    let param = ctx.request.body;
    let username = param.username;
    let password = param.password;
    let password1 = param.password1;
    if (password != password1) {
        ctx.method.genError(ERROR_CODE.PASSWORD_NOTSAME);
        return;
    }
    let result = await logic_mgr.register(username, password);
    if (result.code > SUCCESS_CODE) {
        ctx.method.genError(result.code);
        return;
    }
    let token = util.token.encrypt({ uid: result.uid });
    ctx.response.body = { info: result, token: token }
    await next();
}
RouterMgr.prototype.nextArea = async function (ctx, next) {
    let param = ctx.request.body;
    let aid = param.aid;
    let areaInfo = await logic_mgr.getAreaInfo(aid);
    if (areaInfo == null) {
        ctx.method.genError(ERROR_CODE.AREA_NOTEXIST);
        return;
    }
    if (areaInfo.ismaintenance == 1) {
        ctx.method.genError(ERROR_CODE.AREA_MAINTENANCE);
        return;
    }
    let rows = await mysql.queryAsync('SELECT * FROM player_info WHERE aid = ? AND uid = ?', [aid, ctx.user.uid]);

    let players = JSON.parse(JSON.stringify(rows));

    let token = util.token.encrypt({ uid: ctx.user.uid, aid: aid });
    ctx.response.body = { token: token, players: players };
    await next();
}
RouterMgr.prototype.enterGame = async function (ctx, next) {
    let param = ctx.request.body;
    let pid = param.pid;
    let aid = ctx.user.aid;
    if (aid == null) {
        ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
        return;
    }
    let config = server_config.getConnectServerConfigByAID(ctx.user.aid);

    let token = util.token.encrypt({ uid: ctx.user.uid, aid: aid, pid: pid });

    ctx.response.body = { token: token, url: `${config.ip}:${config.port}` };
    await next();
}

module.exports = function () { return new RouterMgr(); };