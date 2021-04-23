
var Logic = function () { };
Logic.prototype.createPlayer = async function (aid, uid, avatarid, name) {
    if (await this.getPlayerSum(aid, uid) >= GAME_CONFIG.MAX_PLAYER_SUM) {
        return genErrorMsg(ERROR_CODE.PLAYER_SUM_MAX);
    }
    if (!REGULAR_CODE.GAMENAME_VALID.test(name)) {
        return genErrorMsg(ERROR_CODE.GAMENAME_NOTVALID);
    }
    if (await this.isGameNameExist(aid, name)) {
        return genErrorMsg(ERROR_CODE.GAMENAME_EXIST);
    }
    let rows = await mysql.callAsync('CALL create_player(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', GAME_CONFIG.GET_CREATE_PLAYER_DATA(aid, uid, avatarid, name, Date.unix()));
    if (rows.length > 0) {
        return rows[0];
    }
    return genErrorMsg(ERROR_CODE.UNKNOWN_ERROR);
}
Logic.prototype.delPlayer = async function (pid) {
    let row = await mysql.queryAsync('UPDATE player_info SET type = 1,delTime = ? WHERE pid = ? AND type = 0', [Date.unix(), pid]);
    if (row.affectedRows > 0) {
        return true;
    }
    return false;
}
Logic.prototype.getPlayers = async function (aid, uid) {
    let rows = await mysql.queryAsync('SELECT * FROM player_info WHERE aid = ? AND uid = ? AND type = 0', [aid, uid]);
    return rows;
}
Logic.prototype.getPlayerSum = async function (aid, uid) {
    let rows = await mysql.queryAsync('SELECT name FROM player_info WHERE type = 0 AND uid = ? AND aid = ?', [uid, aid]);
    return rows.length;
}

Logic.prototype.isGameNameExist = async function (aid, name) {
    let rows = await mysql.queryAsync('SELECT name FROM player_info WHERE aid = ? AND name = ?', [aid, name]);
    if (rows.length > 0) {
        return true;
    }
    return false;
}
Logic.prototype.isUserExist = async function (username) {
    let rows = await mysql.queryAsync('SELECT username FROM user_info WHERE username = ?', username);
    if (rows.length > 0) {
        return true;
    }
    return false;
}
Logic.prototype.isPlayerExist = async function (pid) {
    let rows = await mysql.queryAsync('SELECT pid FROM player_info WHERE pid = ? AND type = 0', pid);
    if (rows.length > 0) {
        return true;
    }
    return false;
}
Logic.prototype.login = async function (username, password) {
    let rows = await mysql.queryAsync('SELECT * FROM user_info WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
        await mysql.queryAsync('UPDATE user_info SET loginTime = ? WHERE uid = ?', [Date.unix(), rows[0].uid]);
        return rows[0];
    }
    return genErrorMsg(ERROR_CODE.PASSWORD_ERROR);
}
Logic.prototype.register = async function (username, password) {
    if (!REGULAR_CODE.USERNAME_VALID.test(username)) {
        return genErrorMsg(ERROR_CODE.USERNAME_NOTVALID);
    }
    if (!REGULAR_CODE.PASSWORD_VALID.test(password)) {
        return genErrorMsg(ERROR_CODE.PASSWORD_NOTVALID);
    }
    if (await this.isUserExist(username)) {
        return genErrorMsg(ERROR_CODE.USERNAME_EXIST);
    }
    let rows = await mysql.callAsync('CALL create_user(?,?,?)', [username, util.md5(password), Date.unix()]);
    if (rows.length > 0) {
        return rows[0];
    }
    return genErrorMsg(ERROR_CODE.UNKNOWN_ERROR);
}
Logic.prototype.getAreaInfoList = async function () {
    let rows = await mysql.queryAsync('SELECT * FROM area_info WHERE ISNULL(paid) ORDER BY createTime DESC');
    return rows;
}
Logic.prototype.getAreaInfo = async function (aid) {
    let rows = await mysql.queryAsync('SELECT * FROM area_info WHERE aid = ? AND ISNULL(paid) ORDER BY createTime DESC', [aid]);
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
}




module.exports = function () { return new Logic(); };