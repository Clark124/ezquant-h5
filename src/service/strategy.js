import { get, post, mainUrl, put } from '../utils/index'

//所有组合条件
export function listAllTypeById(data) {
  return get(`${mainUrl}/selectstock/listFinancialParameterByTypeId/${data.id}`);
}

//搭建详情 
export function strategyBuildDetail(data) {
  return get(`${mainUrl}/strategyinfo/strategyBuildController/strategyDetail`, data)
}

//保存 --搭建策略
export function strategyBuilderSave(data) {
  return post(`${mainUrl}/strategyinfo/strategyBuildController/strategyBuilderSave`, data, true)
}

// 我的策略 
export function strategyList(data) {
  return get(`${mainUrl}/strategyinfo/strategyBuildController/strategyList`, data);
}

export function hotStrategyList(data){
  return get(`${mainUrl}/strategyinfo/strategyBuildController/hotStrategy`, data);
}

// 删除我的策略 
export function strategyListDelete(data) {
  return get(`${mainUrl}/strategyinfo/strategyBuildController/strategyDelete`, data)
}


//编辑策略 回测
export function backTestEdit(data) {
  return post(`${mainUrl}/strategyinfo/strategyBuildController/backtestByCodes`, data)
}


//单个回测报告详情
export function singleBacktestDetail(data) {
  return get(`${mainUrl}/strategyinfo/strategyBuildController/singleBacktestDetail`, data)
}

export function runStrategyLog(data) {
  return get(`${mainUrl}/strategy_hosting/query/list_user_strategy_signals`, data);
}


//策略的暂停
export function strategyStop(data) {
  return put(mainUrl + '/strategy_hosting/operator/pause_strategy?strategyId=' + data.id)
}
//策略的运行
export function strategyRun(data) {
  return put(mainUrl + '/strategy_hosting/operator/run_strategy?strategyId=' + data.id)
}

//发布策略
export function pushlishStrategy(data) {
  return put(`${mainUrl}/strategy_hosting/manager/publish`, data)
}



export function deleteDeploy(data) {
  return put(mainUrl + '/strategy_hosting/operator/cancel_strategy?strategyId=' + data.id)
}

//切换信号通知
export function changeNotice(data) {
  return put(`${mainUrl}/singalpush/singalEnable/update?userId=${data.userId}&singalTypeId=${data.singalTypeId}&singalSourceId=${data.singalSourceId}&isWeixinNotice=${data.isWeixinNotice}&isSystemNotice=${data.isSystemNotice}`)
}

//删除订阅
export function deleteFollow(data) {
  return put(mainUrl + '/strategy_hosting/manager/del_from_mysubscribe?myStrategyId=' + data.id)
}

//订阅新
export function subscribeStrategy(data) {
  return post(`${mainUrl}/strategy_hosting/manager/add_to_mysubscribe`, data)
}



export function userCollect(data) {
  return post(`${mainUrl}/strategy_hosting/manager/add_to_myFavorite`, data)
}

//取消收藏
export function userDeleteCollect(data) {
  return put(`${mainUrl}/strategy_hosting/manager/delete_from_myFavorite`, data)
}




//实盘报告
export function queryStrategyReport(data) {
  return get(`${mainUrl}/strategy_hosting/query/getRealReport`, data);
}


//热门策略 
export function quantHotStrategy(data) {
  return get(`${mainUrl}/strategyinfo/strategyBuildController/hotStrategy`, data);
}

//市场扫描删除
export function scanListDelete(data) {
  return put(`${mainUrl}/strategy_hosting/scanMarket/cancel_scan/${data.id}`)
}

//修改市场扫描托管状态
export function scanListStatus(data) {
  return put(`${mainUrl}/strategy_hosting/scanMarket/run_scan/${data.id}`)
}

//暂停扫描托管
export function pauseScanDeploy(data) {
  return put(`${mainUrl}/strategy_hosting/scanMarket/pause_scan/${data.id}`)
}

//市场扫描信号列表
export function scanSignalList(data){
  return  get(`${mainUrl}/strategy_hosting/scanMarket/exec_scan_by_id/${data.id}`)
}

//策略排行榜 
export function strategyRankList(data){
  return  get(`${mainUrl}/strategy_hosting/query/list_strategy_sort`,data)
}


