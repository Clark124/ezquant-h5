import { get, post, mainUrl, put } from '../utils/index'


//
export function getToken(data) {
    return get(`${mainUrl}/userinfo/userController/wxUserInfoByCode`, data);
}

//登录
export function login(data) {
    return post(`${mainUrl}/userinfo/userController/login`, data);
}

//发送验证码
export function sendCode(data) {
    return get(`${mainUrl}/userinfo/userController/sendCode`, data);
}
export function bindPhone(data) {
    return post(`${mainUrl}/userinfo/userController/bindPhone`, data);
}

//注册 GET 
export function userRegist(data) {
    return post(`${mainUrl}/userinfo/userController/regist`, data);
}

//是否关注公众号  
export function isSubscribeQrCode(data) {
    return get(`${mainUrl}/singalpush/isSubscribeState`, data)
}

export function strategyRankList(data) {
    return get(`${mainUrl}/strategy_hosting/query/list_strategy_sort`, data)
}

//推荐选股条件 
export function chosenCondition(data) {
    return get(`${mainUrl}/selectstock/list_first_page_select_stock_sort`, data)
}
//推荐市场扫描 
export function marketScan(data) {
    return get(`${mainUrl}/strategy_hosting/scanMarket/list_first_page_scan_sort`, data)
}


//组合排行
export function listComboxListInfo(data) {
    return get(`${mainUrl}/comboselectstock/comboInfo/listComboxListInfo`, data);
}

//托管的策略
export function runStrategy(data) {
    return get(`${mainUrl}/strategy_hosting/query/list_user_strategy_summary`, data);
}

//市场扫描列表  
export function scanList(userId, data) {
    return get(`${mainUrl}/strategy_hosting/scanMarket/listUserScanMarket/${userId}`, data)
}

//我的组合
export function listMyComboInfo(data) {
    return get(`${mainUrl}/comboselectstock/comboInfo/listMyComboInfoPage`, data);
}

//交易信号
export function tradeRecord(data) {
    return get(`${mainUrl}/singalpush/singalRecord/listUserSingalRecord`, data);
}

export function searchCode(data) {
    return get(`${mainUrl}/quote/base_info_query/list_find_prod_code`, data);
}

//股票池名称列表
export function getPoolList(data) {
    return get(mainUrl + '/userinfo/userController/stockPoolList', data)
}

//根据Id 股票池标的列表
export function getPoolCodeList(data) {
    return get(mainUrl + '/userinfo/userController/userOptionalList', data)
}
//股票池删除股票
export function deleteItemFromPool(data) {
    return get(mainUrl + '/userinfo/userController/deleteUserStock', data)
}
//股票池添加股票
export function addCodeToPool(data) {
    return get(mainUrl + '/userinfo/userController/userOptionalAddStock', data)
}

//创建股票池
export function createContractPool(data) {
    return get(mainUrl + '/userinfo/userController/addStockPool', data)
}


//删除股票池
export function deleteContractPool(data) {
    return get(mainUrl + '/userinfo/userController/deleteUserStockPool', data)
}

//导入股票池
export function importContractPool(data) {
    return get(mainUrl + '/userinfo/userController/importUserOptional', data)
}

//消息中心 --未读数量
export function messageNotRead(data) {
    return get(`${mainUrl}/singalpush/singalRecord/unReadCount`, data);
}

//消息中心 
export function messageCenter(data) {
    return get(`${mainUrl}/singalpush/singalRecord/listUserSingalRecord`, data);
}
//消息中心 --全部已读
export function messageAllRead(data) {
    return put(`${mainUrl}/singalpush/singalRecord/allRead`, data);
}

//将期货账户设置为默认
export function setAccountDefault(data) {
    return get(`${mainUrl}/userinfo/userController/updateUserAccountDefaul`, data);
}

//获取用户积分
export function queryPoint(data) {
    return get(`${mainUrl}/singalpush/userScore/getUserScore`, data);
}

//订单列表
export function orderList(data) {
    return get(`${mainUrl}/userinfo/userController/myOrder`, data);
}

//修改密码
export function updatePassword(data) {
    return post(`${mainUrl}/userinfo/userController/updatePassword`, data, true);
}

//上传图片
export function uploadImg(data) {
    return post(`http://upload.spd9.com/file/upload`, data, true);
}

//保存头像
export function uploadAvatar(data) {
    return post(`${mainUrl}/userinfo/userController/updatePortrait`, data);
}

//修改用户昵称
export function updateNickname(data) {
    return post(`${mainUrl}/userinfo/userController/updateNickname`, data);
}

//修改用户简介
export function updateBrief(data) {
    return post(`${mainUrl}/userinfo/userController/updateBrief`, data);
}

export function getWxConfig(data) {
    return get(`${mainUrl}/userinfo/userController/wxPayConfig`, data)
}

//获取微信支付数据
export function getWxPayOrder(data) {
    return get(`${mainUrl}/userinfo/userController/userRecharge`, data)
}

export function getWxPayData(data) {
    return get(`${mainUrl}/userinfo/userController/userPay`, data)
}


//获取账户列表
export function getOtherUserByPhone(data) {
    return get(`${mainUrl}/userinfo/userController/getOtherUserByPhone`, data)
}