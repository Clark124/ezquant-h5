import { CHANGE_STOCK_DATA, CHANGE_QUOTE_DATA, SET_ACCOUNT ,CHANGE_PERIOD,CHANGE_CODE,CHANGE_FAV,SET_CURRENT_POSITION,
    SET_ACCOUNT_LIST,SET_MY_STRATEGY_LIST,SET_STRATEGY_INDEX,SET_CURRENT_ACCOUNT_ID,UPDATE_TRUST_DATA,CHANGE_CHART_TYPE} from './actionTypes'

import { getKline, getQuote, getNewKline } from '../../service/traderoom'
import { changeNumber } from '../../utils/index'

import { Toast } from 'antd-mobile'

export const changeStockData = (data) => {
    return {
        type: CHANGE_STOCK_DATA,
        data
    }
}

export const changeCode = (data) => ({
    type: CHANGE_CODE,
    data
})

export const changePeriod = (data)=>{
    return {
        type: CHANGE_PERIOD,
        data
    }
}

export const changeQuoteData = (data) => ({
    type: CHANGE_QUOTE_DATA,
    data
})

export const setAccount = (data) => ({
    type: SET_ACCOUNT,
    data
})

export const setAccountList = (data)=>({
    type: SET_ACCOUNT_LIST,
    data
})

export const setCurrentAccountId = (data)=>({
    type:SET_CURRENT_ACCOUNT_ID,
    data,
})

export const changeFav = (data)=>({
    type: CHANGE_FAV,
    data
})

export const setMyStrategyList = (data)=>({
    type:SET_MY_STRATEGY_LIST,
    data
})

export const setStrategyIndex = (data)=>({
    type:SET_STRATEGY_INDEX,
    data
})

export const updateTrustData = (data)=>({
    type:UPDATE_TRUST_DATA,
    data
})

export const changeChartType = (data)=>({
    type:CHANGE_CHART_TYPE,
    data
})

export const setCurrentPosition = (data)=>({
    type:SET_CURRENT_POSITION,
    data
})


export const onGetKline = (code, period, callback, uuid) => {
    return (dispatch) => {
        // dispatch(clearKline())
        let params = {}
        if (uuid) {
            params = {
                prod_code: code, period, uuid,
            }
        } else {
            params = {
                prod_code: code, period,
            }
        }
        getKline(params).then(res => {
            if (res.data) {
                let data = res.data.candle[code]
                // data = changeNumber(data, 2)
                // data[252].annotation = {buySell:1,text:'曙光初现'}
                // data[270].annotation = {buySell:2,text:'卖出提示'}
                dispatch(changeStockData(data))
                if (callback) {
                    callback(data)
                }
            } else {
                Toast.fail(res.message)
            }

        })
    }
}

export const onGetNewKline = (code, period, callback) => {
    return (dispatch) => {
        const params = {
            prod_code: code, period,
            count: 300
        }
        getNewKline(params).then(res => {
            let data = res.data.candle[code]
            dispatch(changeStockData(data))
                if (callback) {
                    callback(data)
                }
        })
    }
}

export const onGetQuote = (code,) => {
    return (dispatch) => {
        getQuote({ prod_code: code, }).then(res => {
            let ret = {}
            if (res.data) {
                ret = res.data[0]
            } else if (res[0]) {
                ret = res[0]
            }

            dispatch(changeQuoteData(ret))
        })
    }
}
