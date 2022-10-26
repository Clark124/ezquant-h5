import axios from 'axios';
import moment from 'moment'
// import lodash from 'lodash'
import { getWxConfig ,isSubscribeQrCode} from '../service/index'
import wx from "weixin-js-sdk"
import {Toast,Dialog} from 'antd-mobile-v5'

axios.interceptors.response.use(res => {
    if (res.data.retCode === -2 || res.data.retCode === -1 || res.code === -1 || res.data.code === 205) {
        // alert('请重新登录')
        localStorage.removeItem('userInfo');
        Toast.show({
            icon:'fail',
            content:"请重新登录",
            afterClose: () => {
                window.location = '/#/user'
            }

        })
        return;
    } else {
        return res;
    }
}, err => {
    console.log(err)
    Toast.clear()
    Toast.show({
        icon:'fail',
        content:"服务端出错",
    })
});

function stringifyURL(params, postFlag) {
    var paramUrl = '';
    for (var key in params) {
        if (!postFlag && paramUrl === '') {
            paramUrl += '?' + key + '=' + encodeURIComponent(params[key]);
        } else {
            paramUrl += '&' + key + '=' + encodeURIComponent(params[key]);
        }
    }
    return paramUrl;
}
export const wsHost = process.env.NODE_ENV === 'development' ? 'ws://106.55.172.170:9021' : window.api.wsHost
export const mainUrl = process.env.NODE_ENV === 'development' ? 'http://106.55.172.170:9021' : window.api.host
// export const mainUrl = 'http://115.159.102.28:9021'
export const host = process.env.NODE_ENV === 'development' ? 'http://106.55.172.170:9021' : window.api.host
export const wsCtpHost = process.env.NODE_ENV === 'development' ? 'ws://106.55.172.170:9021' : window.api.wsCtpHost

export function get(url, data) {
    return new Promise((resolve, reject) => {
        const token = localStorage.userInfo ? JSON.parse(localStorage.userInfo).token : '';
        const userId = localStorage.userInfo ? JSON.parse(localStorage.userInfo).id : '';
        axios.get(url, { params: data, headers: { token, userId } })
            .then(res => {
                if (res !== undefined) {
                    resolve(res.data);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function post(url, data, isJson = false, head) {
    return new Promise((resolve, reject) => {
        data = isJson ? data : stringifyURL(data, true);
        const token = localStorage.userInfo ? JSON.parse(localStorage.userInfo).token : '';
        const userId = localStorage.userInfo ? JSON.parse(localStorage.userInfo).id : '';
        if (!head) {
            head = {}
        }
        let header = isJson
            ? { 'Content-type': 'application/json', token, userId, ...head }
            : { 'Content-Type': 'application/x-www-form-urlencoded', token, userId, ...head };
        axios.post(url, data, {
            headers: header,
        }).then(res => {
            if (res.data) {
                resolve(res.data);
            }
        }).catch(err => {
            console.log(err)
            Toast.fail('服务报错')
            reject(err);
        });
    });
}

export function put(url, data) {
    return new Promise((resolve, reject) => {
        if (data) {
            data = stringifyURL(data)
        } else {
            data = ""
        }
        const token = localStorage.userInfo ? JSON.parse(localStorage.userInfo).token : '';
        const userId = localStorage.userInfo ? JSON.parse(localStorage.userInfo).id : '';

        axios.put(url + data, null, { headers: { token, userId } }).then(res => {
            if (res.data) {
                resolve(res.data);
            }
        }).catch(err => {
            Toast.fail('服务报错')
            reject(err);
        });
    });
}

export function deleteApi(url, data) {
    return new Promise((resolve, reject) => {
        const token = localStorage.userInfo ? JSON.parse(localStorage.userInfo).token : '';
        const userId = localStorage.userInfo ? JSON.parse(localStorage.userInfo).id : '';
        axios.delete(url, { params: data, headers: { token, userId } }).then(res => {
            if (res !== undefined) {
                resolve(res.data);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

/*k线数据格式化成图形需要的格式*/
export function changeNumber(Array, tickSize) {
    let arr = []
    Array.forEach((item) => {
        let date = ""
        if (item[0].toString().length === 8) {
            date = new Date(moment(item[0].toString(), 'YYYYMMDD').format('YYYY-MM-DD'))
        } else if (item[0].toString().length === 12) {
            date = new Date(moment(item[0].toString(), 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm'))
        }
        arr.push({
            close: Number(item[4]),
            high: Number(item[2]),
            low: Number(item[3]),
            open: Number(item[1]),
            date: date,
            volume: item[5]
        })

    })
    return arr
}


export function debounce(func, wait, immediate) {
    let timeout

    return function () {
        let context = this
        let args = arguments

        if (timeout) clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait)
            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait)
        }
    }
}

export const getSdkConfig = () => {
    let url = window.location.href.split("#")[0];
    // console.log(url)
    getWxConfig({ url }).then(res => {
        const data = res.data;
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: Number(data.timestamp),
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
        });
        wx.error(function (err) {
            console.log("初始化失败！");
            alert(err);
        });

        wx.ready(function () {
            wx.chooseWXPay({
                appId: data.appId,
                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign, // 支付签名
                timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                success: function (res) {
                    alert("支付成功");
                    // 支付成功后的回调函数
                    // 执行成功的回调操作 
                },
                fail: function (res) {
                    alert("支付失败");
                    alert(res.errMsg);
                }
            })

        })
    })
}

//智能选股结果参数对应
export const chineseToTng = {
    'roe': '净资产收益率',
    'naps': '每股净资产',
    'assetsLiabilities': '资产负债率',
    'basicEps': '基本每股收益',
    'netProfitRatio': '净利率',
    'grossProfitRate': '毛利率',
    'stockSameRate': '每股收益同比增长率',
    'netSameRate': '净利润同比增长率',
    'orSameRate': '营业收入同比增长率',
    'dividendYield': '股息率',
    'stockMoneyFlow': '每股经营现金流',
    'inventoryTurnoverRatio': '存货周转率',
    'earningsPerShare': '每股收益',
    'netProfit3y': '净利润3年复合增长率',
    'returnOnAssets3y': '连续3年净资产收益率',
    'pe': '市盈率（静态）',
    'dynPe': '市盈率（动态）',
    'pb': '市净率',
    'ps': '市销率',
    'peg': 'PEG',
    'theCityRate': '市现率',
    'circulationMarketValue': '流通市值',
    'totalMarketValue': '总市值',
    'circulatingCapital': '流通股本',
    'totalShares': '总股本',
    'flowShareholdingRatioTop10': '前十大流通股东持股比例合计',
    'shareholdingRatioTop10': '前十大股东持股比例合计',
    'issueDate': '上市时间',
    'issueDay': '上市时长',
    'ponus': '派现融资比',
    'foreignCapitalSharehdNum': '外资持股数量',
    'foreignCapitalSharehdPct': '外资持股占比',
    'foreignCapitalSharehdNumchange': '外资持股数量变化',
    'foreignCapitalSharehdPctchange': '外资持股占比变化',
    'inFlowRate': '主力净流入率',
    'finBalance': '融资余额',
    'profitRatio': '盈利比率',
    'averageCost': '平均成本',
    'averageCostRatio': '平均成本比率',
    'amplitude': '日振幅',
    'volRatio': '量比',
    'turnover5Ratio': '5日换手率',
    'turnoverRatio': '日换手率',
    'pxChangeRate': '日涨跌幅',
    'day5Chgpct': '5日涨跌幅',
    'day20Chgpct': '20日涨跌幅',
    'day60Chgpct': '60日涨跌幅',
    'yearUpDownRate': '年涨跌幅',
    'yearUpDownRate': '年跌幅',
    'historyNewHeight': '创历史新高',
    'historyNewLow': '创历史新低',
    'serialUpDay': '连涨天数',
    'serialDownDay': '连跌天数',
    'beta': '贝塔值',
    'statisticsPcc': '相似k线'
}

export const isSubGZH = (navigate) => {
    return new Promise((resolve, reject) => {
        let userInfo = localStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            maskClickable:false
        })
        isSubscribeQrCode({ userId: userInfo.id }).then(res => {
            Toast.clear()
            if (res === 'unsubscribe') {
                Dialog.confirm({
                    content: "请关注微信公众号",
                    onConfirm:()=>{
                        navigate('/qrCode')
                    }
                })
                resolve(false)
            }else{
                resolve(true)
            }
        }).catch(err=>{
            Toast.clear()
            
        })
    })



}
