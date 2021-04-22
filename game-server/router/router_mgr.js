
var RouterMgr = function () { };

RouterMgr.prototype.test = async function (ctx, player, data) {
    console.log(data.info);

    await ctx.method.callback({});
}

RouterMgr.prototype.enterGame = async function (ctx, player, data) {
    //console.log("enterGame", data, player.baseInfo, ctx.data.pid);

    player.set_loginTime(Date.unix())
    player.set_online(1)
    await player.upDataToDB();

    player.upAllClientData();

    await ctx.method.callback({});
}

module.exports = function () { return new RouterMgr(); };