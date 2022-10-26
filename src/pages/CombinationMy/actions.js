import { CHANGE_TRADE_SET_VALUE,CHANGE_SELECT_TIME_VALUE ,CHANGE_RISK_SET_VALUE,CHANGE_FIRST_EDIT_STATUS,UPDATE_TRADE_SETTTING,UPDATE_SELECT_TIME,
    UPDATE_RISKSET,SET_COMPOSE_ID
} from "./actionTypes"

export const changeTradeSetValue = (data)=>({
    type:CHANGE_TRADE_SET_VALUE,   
    data,
})

export const changeSelectTimeValue = (data)=>({
    type:CHANGE_SELECT_TIME_VALUE,   
    data,
})

export const changeRiskSetValue = (data)=>({
    type:CHANGE_RISK_SET_VALUE,   
    data,
})

export const changeFirstEditStatus = (data)=>({
    type:CHANGE_FIRST_EDIT_STATUS,   
    data,
})

export const updateTradeSetting = (data)=>({
    type:UPDATE_TRADE_SETTTING,
    data
})

export const updateSelectTime = (data)=>({
    type:UPDATE_SELECT_TIME,
    data
})
export const updateRiskSet = (data)=>({
    type:UPDATE_RISKSET,
    data
})
export const setComposeId = (data)=>({
    type:SET_COMPOSE_ID,
    data
})
