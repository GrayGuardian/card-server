var RpcRouter = function () { };
RpcRouter.prototype.getAreaInfoList = async function (data, callback) {

    callback({ areaInfos: await logic_mgr.getAreaInfoList() });
}
module.exports = function () { return new RpcRouter(); };