

import { get, host, post, put, deleteApi } from '../utils/index'


const newHost = host


export function getKline(data) {
    return get(newHost + '/userinfo/userController/quoteInternalKline', data)
}
export function lastKline(data) {
    return get(newHost + '/last/kline', data)
}

//新版获取K线行情数据
export function getNewKline(data) {
    return get(newHost + '/quote/kline/all_latest_time', data)
}

//查询股票代码的行情
export function getQuote(data) {
    return get(newHost + '/quote/all_real', data)
}



//默认账户
export function defaultAccount(data) {
    return get(`${newHost}/userinfo/userController/userAccountDefaul`, data);
}

//查询账户资金
export function getAccountFund(data) {
    return get(`${newHost}/ctptrade/queryAccount`, data);
}

//下单
export function orderInput(data) {
    return get(`${newHost}/ctptrade/orderinput`, data);
}

//定时下单
export function timeOrderInput(data) {
    return get(`${newHost}/ctptrade/ctporderManager/timeOrder`, data);
}


//持仓
export function queryPosition(data) {
    return get(`${newHost}/ctptrade/querySymbolPositionFund`, data);
}

//查询撤单列表
export function queryOrder(data) {
    return get(newHost + '/ctptrade/queryOrder', data);
}

//定时订单列表
export function TimeOrderList(data) {
    return get(`${newHost}/ctptrade/ctporderManager/queryTimeOrdersByUserId`, data)
}

//高级单平仓
export function closePositionTimeOrder(data){
    return get(`${newHost}/ctptrade/ctporderManager/forceCloseTimeOrder`,data)
}

//历史记录
export function historyTrade(data) {
    return get(newHost + '/ctptrade/ctpinfo/queryStrategyTradeInfoPair', data)
}

//历史记录 最近
export function historyTradeRecent(data) {
    return get(newHost + '/ctptrade/ctpinfo/queryStrategyTradeInfoPairLimitNumber', data)
}


//当前仓位
export function currentPositionList(data) {
    return get(`${newHost}/ctptrade/ctpinfo/queryStrategyAllPosition`, data);
}

//运行策略
export function runStrategy(data) {
    return get(`${newHost}/strategy_hosting/query/list_user_strategy_summary`, data);
}
//最优策略
export function optimalStrategyList(data) {
    return get(`${newHost}/strategyinfo/strategyBuildController/backtestOptimalList`, data);
}

//发布的策略
export function deployList(data) {
    return get(`${newHost}/strategy_hosting/query/list_publish`, data)
}


//我跟单的策略
export function followList(data) {
    return get(`${newHost}/strategy_hosting/query/list_subscribe`, data)
}

export function followListFunc(data) {
    return get(`${newHost}/strategy_hosting/query/list_subscribe`, data)
}

//我收藏的策略
export function shareList(data) {
    return get(`${newHost}/strategy_hosting/query/list_favorite`, data)
}


//成交日志
export function historyLog(data) {
    return get(`${newHost}/ctpinfo/queryOrderLogList`, data)
}

//回执
export function histroyEntrustList(data) {
    return post(`${newHost}/ctpinfo/queryOrderInputInfoList`, data)
}

//报单回报
export function declarationReturn(data) {
    return post(`${newHost}/ctpinfo/queryOrderList`, data)
}

//成交回报
export function dealReturn(data) {
    return post(`${newHost}/ctpinfo/queryTradeList`, data)
}

//自选列表
export function favorList(data) {
    return get(`${newHost}/userinfo/userController/userOptionalList`, data);
}

//添加自选
export function addFavor(data) {
    return get(`${newHost}/userinfo/userController/userOptionalAddStock`, data);
}

//删除自选
export function deleteFavor(data) {
    return get(`${newHost}/userinfo/userController/deleteUserStock`, data);
}
//撤单
export function cancelOrder(data) {
    return get(newHost + '/ctptrade/orderaction', data);
}

////平策略持仓
export function closeStrategyAllPosition(data) {
    return post(`${newHost}/ctptrade/closeStrategyAllPosition`, data)
}


//回测
export function backtestSignal(data) {
    return get(`${newHost}/strategy_hosting/query/list_user_strategy_kline_signals`, data)
}

export function backtestSignalLast(data) {
    return get(`${newHost}/strategy_hosting/query/list_last_strategy_kline_signals`, data)
}

//最优策略回测
export function backtestOptimalSignal(data){
    return get(`${newHost}/strategyinfo/strategyBuildController/backtestOptimalDetail/${data.id}`,data)
}

//最优策略详情
export function startegyDetail(data){
    return get(`${newHost}/strategyinfo/strategyBuildController/backtestOptimalDetail/${data.releaseId}`);
}


//账户列表
export function accountList(data) {
    return get(`${newHost}/userinfo/userController/userAccountList`, data);
}

//策略列表
export function strategyList(data) {
    return get(`${newHost}/strategyinfo/strategyBuildController/strategyList`, data);
}

//托管
export function deployStrategy(data, head) {
    return post(`${newHost}/strategy_hosting/operator/add_strategy_hosting`, data, false, head);
}

//托管详情
export function deployStrategyDetail(data) {
    return get(`${newHost}/strategy_hosting/query/get_user_strategy_detail`, data)
}

//策略的暂停
export function strategyStop(data) {
    return put(newHost + '/strategy_hosting/operator/pause_strategy?strategyId=' + data.id)
}
//策略的运行
export function strategyRun(data) {
    return put(newHost + '/strategy_hosting/operator/run_strategy?strategyId=' + data.id)
}

//删除托管策略
export function deleteDeploy(data) {
    return put(newHost + '/strategy_hosting/operator/cancel_strategy?strategyId=' + data.id)
}

//托管更新
export function deployStrategyUpdate(data) {
    return put(`${newHost}/strategy_hosting/operator/update_strategy`, data)
}


//删除期货账户
export function deleteAccount(data) {
    return deleteApi(`${newHost}/userinfo/userController/userAccountDelete`, data)
}

//更新高级单
export function updateTimeOrder(data){
    return get(`${newHost}/ctptrade/ctporderManager/updateTimeOrder`,data)
}

//最小变动价
export function getPriceTick(data){
    return get(`${newHost}/ctptrade/getPriceTickBySymbol`,data)
}

export function getQuote1(data) {
    return get(newHost + '/ctptrade/SubMarketBean?', data)
}

//修改期货 测单价格
export function updateCancelOrderPrice(data){
    return get(`${newHost}/ctptrade/modifyorder`, data);
}
