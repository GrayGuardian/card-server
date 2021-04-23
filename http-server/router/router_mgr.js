
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
    let areaInfos = await logic_mgr.getAreaInfoList();
    let areaInfo = areaInfos[0];
    if (user.lastAid != null) {
        areaInfos.forEach(element => {
            if (user.lastAid == element.aid)
                areaInfo = element;
        });
    }
    let data = { info: user };
    data.token = util.token.encrypt({ uid: user.uid });
    data.areaInfos = areaInfos;
    data.areaInfo = areaInfo;
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
RouterMgr.prototype.createPlayer = async function (ctx, next) {
    let param = ctx.request.body;
    let name = param.name;
    let avatarid = param.avatarid;
    let uid = ctx.user.uid;
    let aid = ctx.user.aid;
    if (uid == null) {
        ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
        return;
    }
    if (aid == null) {
        ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
        return;
    }
    let player = await logic_mgr.createPlayer(aid, uid, avatarid, name);
    if (player.code > SUCCESS_CODE) {
        ctx.method.genError(player.code);
        return;
    }
    ctx.response.body = { info: player }
    await next();
}
RouterMgr.prototype.delPlayer = async function (ctx, next) {
    let param = ctx.request.body;
    let pid = param.pid;

    if (!await logic_mgr.delPlayer(pid)) {
        ctx.method.genError(ERROR_CODE.CONNECT_ERROR_DATA);
        return;
    }
    ctx.response.body = { pid: pid }
    await next();
}
RouterMgr.prototype.nextArea = async function (ctx, next) {
    let param = ctx.request.body;
    let aid = param.aid;
    let uid = ctx.user.uid;
    if (uid == null) {
        ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
        return;
    }
    let areaInfo = await logic_mgr.getAreaInfo(aid);
    if (areaInfo == null) {
        ctx.method.genError(ERROR_CODE.AREA_NOTEXIST);
        return;
    }
    if (areaInfo.ismaintenance == 1) {
        ctx.method.genError(ERROR_CODE.AREA_MAINTENANCE);
        return;
    }

    await mysql.queryAsync('UPDATE user_info SET lastAid=? WHERE uid=?', [aid, uid]);

    let players = JSON.parse(JSON.stringify(await logic_mgr.getPlayers(aid, uid)));

    let token = util.token.encrypt({ uid: uid, aid: aid });
    ctx.response.body = { token: token, players: players };
    await next();
}
RouterMgr.prototype.enterGame = async function (ctx, next) {
    let param = ctx.request.body;
    let pid = param.pid;
    let uid = ctx.user.uid;
    let aid = ctx.user.aid;
    if (uid == null) {
        ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
        return;
    }
    if (aid == null) {
        ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
        return;
    }
    if (!await logic_mgr.isPlayerExist(pid)) {
        ctx.method.genError(ERROR_CODE.PLAYER_NOTEXIST)
        return;
    }
    let config = server_config.getConnectServerConfigByAID(aid);

    let token = util.token.encrypt({ uid: uid, aid: aid, pid: pid });

    ctx.response.body = { token: token, url: `${config.ip}:${config.port}` };
    await next();
}

module.exports = function () { return new RouterMgr(); };