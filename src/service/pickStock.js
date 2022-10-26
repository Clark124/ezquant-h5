import { get, post, mainUrl, put,deleteApi } from '../utils/index'

//组合模块
export function listAllType(data) {
  return get(`${mainUrl}/selectstock/listAllType`, data);
}
//所有组合条件
export function listAllTypeById(data) {
  return get(`${mainUrl}/selectstock/listFinancialParameterByTypeId/${data.id}`);
}

//指定市场
export function listSelectMarket(data) {
  return get(`${mainUrl}/selectstock/listSelectMarket`, data);
}

//行业板块
export function listAllIndustryType(data) {
  return get(`${mainUrl}/selectstock/listAllIndustryType`, data);
}

//概念板块
export function listAllConceptType(data) {
  return get(`${mainUrl}/selectstock/listAllConceptType`, data);
}

//地区板块
export function listAllRegionalType(data) {
  return get(`${mainUrl}/selectstock/listAllRegionalType`, data);
}

//智能选股
export function listStartSelectStock(data) {
  return post(`${mainUrl}/selectstock/nselect/list_select_stock`, data, true);
}

//删除选股条件列表
export function delteMySelectPick(data){
  return deleteApi(`${mainUrl}/selectstock/deleteSelectStockCondition/${data.id}`);
}

//股票池名称列表
export function getPoolList(data) {
  return get(mainUrl + '/userinfo/userController/stockPoolList', data)
}

//根据Id 股票池标的列表
export function getPoolCodeList(data) {
  return get(mainUrl + '/userinfo/userController/userOptionalList', data)
}

//保存选股条件
export function saveMyConditon(data) {
  return post(`${mainUrl}/selectstock/saveMyConditon`, data, true)
}

//更新选股条件
export function updatePickStock(data){
  return post(`${mainUrl}/selectstock/updateSelectStockCondition`,data,true);
}

//选股条件列表 
export function listMyLocalSelectStock(data) {
  return get(`${mainUrl}/selectstock/listMyLocalSelectStock/${data.id}`);
}

//市场扫描
export function marketScanNew(data) {
  return post(`${mainUrl}/strategy_hosting/scanMarket/execNewScan`, data, true)
}

//市场扫描（托管）
export function marketScanDeploy(data) {
  return post(`${mainUrl}/strategy_hosting/scanMarket/saveScanMarket`, data, true)
}

//市场扫描列表  
export function scanList(userId, data) {
  return get(`${mainUrl}/strategy_hosting/scanMarket/listUserScanMarket/${userId}`, data)
}