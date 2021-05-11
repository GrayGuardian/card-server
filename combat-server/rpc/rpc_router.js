var RpcRouter = function () { };

RpcRouter.prototype.socketRpc = async function (data, callback) {
    let router = data.data.router;

    let action = router_mgr[router]
    if (action == null) {
        console.log("未找到Socket路由", router);
        return;
    }

    let player = await rpc_mgr.getPlayer(data.pid);
    let ctx = {};
    ctx.data = data;
    ctx.method = {};
    ctx.method.kick = async function (code) {
        let config = server_config.getConnectServerConfigByAID(data.aid);
        await rpc_mgr.socketChannelOper(config.name, "kick", [data.socketid, code]);
        callback({});
    }
    ctx.method.genError = async function (code) {
        let config = server_config.getConnectServerConfigByAID(data.aid);
        await rpc_mgr.socketChannelOper(config.name, "genError", [data.socketid, code]);
        callback({});
    }
    ctx.method.callback = async function (body) {
        let config = server_config.getConnectServerConfigByAID(data.aid);
        await rpc_mgr.socketChannelOper(config.name, "send", [data.socketid, `${router}Ret`, body]);
        callback({});
    }
    await action(ctx, player, data.data[router]);
}

module.exports = function () { return new RpcRouter(); };