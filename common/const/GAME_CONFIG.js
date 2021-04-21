const GAME_CONFIG = {}

// ------------ 服务器端专属 ------------
// 创建角色默认数据
GAME_CONFIG.DEFAULT_PLAYER_DATA = {
    // 等级
    LV: 1,
    // VIP等级
    VIP_LV: 2,
    // 当前体力
    VIT_VALUE: 10,
    // 最大体力
    VIT_MAX: 10,
    // 当前精力
    VIG_VALUE: 0,
    // 最大精力
    VIG_MAX: 2000,
    // 铜币数量
    GOLD1: 1000,
    // 银币数量
    GOLD2: 0,
    // 金币数量
    GOLD3: 0,
}
// 获取创建角色数据
GAME_CONFIG.GET_CREATE_PLAYER_DATA = function (uid, aid, avatarid, name, time) {
    let data = [];
    data.push(uid)
    data.push(aid)
    data.push(avatarid)
    data.push(name)
    data.push(time)
    for (var key in GAME_CONFIG.DEFAULT_PLAYER_DATA) {
        data.push(GAME_CONFIG.DEFAULT_PLAYER_DATA[key])
    }
    console.log('默认值>>>>>', data);
    return data;
}

// ------------ 客户端需同步 ------------
// 角色栏位最大数量
GAME_CONFIG.MAX_PLAYER_SUM = 3
// 卡牌强化最大等级
GAME_CONFIG.MAX_CARD_LV = 109;

module.exports = GAME_CONFIG;