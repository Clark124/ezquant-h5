import { get, post, mainUrl, put } from '../utils/index'

//选择股票池---选股  
export function listStartSelectStock1(data) {
    return post(`${mainUrl}/comboselectstock/create_combination/first_step_listselectstock`, data, true);
}

//选择股票池---下一步
export function selectStockNext(data) {
    return get(`${mainUrl}/selectStock/next`, data);
}

//交易设置-- 一级条件 
export function onePriorityCondition(data) {
    return get(`${mainUrl}/comboselectstock/tradeSetting/onePriorityCondition`, data);
}
//交易设置-- 二级条件 
export function twoPriorityCondition(data) {
    return get(`${mainUrl}/comboselectstock/tradeSetting/twoPriorityCondition`, data);
}

//交易设置-- 策略列表
export function listUserStrategy(data) {
    return get(`${mainUrl}/strategyinfo/strategyBuildController/strategyList`, data);
}

//交易设置-- 下一步保存
export function tradeSettingNext(data) {
    return post(`${mainUrl}/comboselectstock/create_combination/second_step_tradeSetting`, data, true);
}

//大盘择时--下一步
export function selectTimeNext(data) {
    return post(`${mainUrl}/comboselectstock/create_combination/third_step_selecttimesetting`, data, true)
}

//风险控制--回测
export function testStrategy(data) {
    return get(`${mainUrl}/comboselectstock/risksetting/testStrategy`, data)
}

//风险控制--下一步
export function risksettingNext(data) {
    return post(`${mainUrl}/comboselectstock/create_combination/fourth_step_risksetting`, data)
}

//我的组合
export function listMyComboInfo(data) {
    return get(`${mainUrl}/comboselectstock/comboInfo/listMyComboInfoPage`, data);
}

//编辑组合 
export function comboInfoDetailEdit(data) {
    return get(`${mainUrl}/comboselectstock/comboInfo/editComboInfo/${data.id}`);
}

//组合更新
export function updateCombination(data) {
    return post(`${mainUrl}/comboselectstock/comboInfo/edit_comboInfo_submit`, data, true)
}

//改变组合运行状态-停止
export function stopComboId(data) {
    return put(`${mainUrl}/comboselectstock/strategyexec/stopCombo/${data.id}`);
}

//改变组合运行状态-运行
export function runComboId(data) {
    return put(`${mainUrl}/comboselectstock/strategyexec/runCombo/${data.id}`);
}

//修改组合列表的交易方式
export function updateCombinationOrder(data) {
    return put(`${mainUrl}/comboselectstock/comboInfo/update_is_order/${data.id}/${data.value}`);
}

export function changeNoticeCombo(data) {
    return put(`${mainUrl}/singalpush/singalEnable/save_or_update?userId=${data.userId}&singalTypeId=${data.singalTypeId}&singalSourceId=${data.singalSourceId}&isWeixinNotice=${data.isWeixinNotice}&isSystemNotice=${data.isSystemNotice}`)
}

//公开组合 
export function comboInfoPublic(data) {
    return put(`${mainUrl}/comboselectstock/comboInfo/publish/${data.comboId}/${data.pubType}`);
}

//删除我的组合 
export function deleteComboInfo(data) {
    return put(`${mainUrl}/comboselectstock/comboInfo/deleteComboInfo/${data.id}`);
}
//组合详情
export function comboDetail(data) {
    return get(`${mainUrl}/comboselectstock/comboInfo/getComboxDetailInfo/${data.id}/${data.userId}`);
}

//订阅组合
export function comboSubscribe(data) {
    return post(`${mainUrl}/comboselectstock/combo_subscribe/save_subscribe`, data);
}

//取消订阅组合
export function comboSubscribeCancel(data) {
    return post(`${mainUrl}/comboselectstock/combo_subscribe/save_subscribe`, data);
}

//我订阅的组合 
export function comboInfoSubscribeMine(data) {
    return get(`${mainUrl}/comboselectstock/combo_subscribe/list_subscribe_info`, data);
}

//删除订阅组合 
export function comboInfoSubscribeDelete(data) {
    return get(`${mainUrl}/comboInfo/subscribe/delete`, data);
}
//组合排行
export function listComboxListInfo(data) {
    return get(`${mainUrl}/comboselectstock/comboInfo/listComboxListInfo`, data);
}
