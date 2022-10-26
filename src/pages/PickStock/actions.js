import {CHANGE_MARKET,CANCEL_MARKET,SELECTED_INDICATE,CHOOSE_INDICATE,UPDATE_INDICATE,SET_SELECTED_LIST,INIT_PICKSTOCK,SET_INDICATE,SET_INDICATE_ARR,
    SET_START_DATE_VALUE,SET_END_DATE_VALUE,SELECTED_STRATEGY,CHOOSE_MARKET,SET_POOL_LIST,SET_POOL_ID,SET_POOL_SELECT_CODE,
    SET_MARKET_ARR,SET_MARKET_OBJ
} from './actionTypes'

export const changeMarket = (data)=>({
    type:CHANGE_MARKET,
    data
})

export const cancelMarket = (data)=>({
    type:CANCEL_MARKET,
    data
})

export const selectedIndicate = (data)=>({
    type:SELECTED_INDICATE,
    data
})

export const chooseIndicate = (data)=>({
    type:CHOOSE_INDICATE,
    data
})

export const chooseMarket = (data)=>({
    type:CHOOSE_MARKET,
    data
})

export const setIndicate = (data)=>({
    type:SET_INDICATE,
    data
})

export const updateIndicate = (data)=>({
    type:UPDATE_INDICATE,
    data
})

export const setSelectedList = (data)=>({
    type:SET_SELECTED_LIST,
    data
})

export const setStartDateValue = (data)=>({
    type:SET_START_DATE_VALUE,
    data,
})

export const setEndDateValue  = (data)=>({
    type:SET_END_DATE_VALUE,
    data,
})

export const selectedStrategy = (data)=>({
    type:SELECTED_STRATEGY,
    data
})

export const setPoolList = (data)=>({
    type:SET_POOL_LIST,
    data
})

export const setPoolId = (data)=>({
    type:SET_POOL_ID,
    data
})

export const setPoolSelectedCode = (data)=>({
    type:SET_POOL_SELECT_CODE,
    data
})


export const initPickStock = ()=>({
    type:INIT_PICKSTOCK,
})

export const setIndicateArr = (data)=>({
    type:SET_INDICATE_ARR,
    data,
})

export const setMarketArr = (data)=>({
    type:SET_MARKET_ARR,
    data
})

export const setMarketObj = (data)=>({
    type:SET_MARKET_OBJ,
    data
})

