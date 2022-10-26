import { CHANGE_TRADE_SET_VALUE, CHANGE_SELECT_TIME_VALUE, CHANGE_RISK_SET_VALUE, CHANGE_FIRST_EDIT_STATUS, UPDATE_TRADE_SETTTING, UPDATE_SELECT_TIME ,
    UPDATE_RISKSET,SET_COMPOSE_ID,
} from './actionTypes'


const actionOneObj = {
    '1':'任一',
    '-1':'全部'
}

const actionTwoObj = {
    0:'空仓',
    30:"30%",
    50:'50%',
}

const defaultState = {
    composeId: "",
    tradeSet: {
        firstConditionValue: {},
        secondConditionValue: {},
        strategy: {
            strategyName: "请选择",
            confirmId: "",
            express: "",
            params: ""
        },
        maxStockNum: 100,
        singlStockBuyRatio: 100,
        singlStockMaxPositionRatio: 100,
        singlCountBuyRatio: 100,
        singlCountSellRatio: 100,
        period: 720,
        periodText: "1天",
        timeValue: '15:00',
    },
    selectTime: {
        isEnable: 0,
        actionOneValue: { text: '任一', value: 1 },
        actioTwoValue: { text: '空仓', value: 0 },
        selectedList: [],
    },
    riskSet: {
        isOnRisk: 0,
        styles: [],
        composeName: "",
        discribe:"",
        initFund: 10,
        stopProfitRatio: 20,
        stopLossRatio: 20,
        moveStopProfitRatio: 20
    },
    isFirstEdit: true

}

export default (state = defaultState, action) => {
    switch (action.type) {
        case SET_COMPOSE_ID:{
            return {
                ...state,composeId:action.data
            }
        }
        case CHANGE_TRADE_SET_VALUE: {
            return {
                ...state, tradeSet: { ...state.tradeSet, [action.data.type]: action.data.value }
            }
        }
        case CHANGE_SELECT_TIME_VALUE: {
            return {
                ...state, selectTime: { ...state.selectTime, [action.data.type]: action.data.value }
            }
        }
        case CHANGE_RISK_SET_VALUE: {
            return {
                ...state, riskSet: { ...state.riskSet, [action.data.type]: action.data.value }
            }
        }

        case CHANGE_FIRST_EDIT_STATUS: {
            return {
                ...state, isFirstEdit: action.data
            }
        }

        case UPDATE_TRADE_SETTTING: {
            return {
                ...state, tradeSet: {
                    ...state.tradeSet,
                    firstConditionValue: { id: action.data.onePriorityCondition },
                    secondConditionValue: { id: action.data.twoPriorityCondition },
                    strategy: {
                        strategyName: action.data.strategyName,
                        confirmId: "",
                        express: "",
                        params: ""
                    },
                    maxStockNum: action.data.maxStockNum,
                    singlStockBuyRatio: action.data.singlStockBuyRatio,
                    singlStockMaxPositionRatio: action.data.singlStockMaxPositionRatio,
                    singlCountBuyRatio: action.data.singlCountBuyRatio,
                    singlCountSellRatio: action.data.singlCountSellRatio,
                    period: action.data.execFrequency,
                    timeValue: action.data.execTime,

                }
            }
        }
        case UPDATE_SELECT_TIME: {
            return {
                ...state, selectTime: {
                    ...state.selectTime,
                    isEnable: action.data.isEnable,
                    actionOneValue: { text: actionOneObj[action.data.count.toString()], value: action.data.count },
                    actioTwoValue: { text: actionTwoObj[action.data.closePostionRatio], value: action.data.closePostionRatio },
                    selectedList: action.data.indicators,
                }
            }
        }

        case UPDATE_RISKSET:{
            return {
                ...state,riskSet:{
                    ...state.riskSet,
                    isOnRisk: action.data.isEnable?action.data.isEnable:0,
                    styles: JSON.parse(action.data.comboStyle),
                    composeName: action.data.comboName,
                    initFund: action.data.initFund/10000,
                    discribe:action.data.description,
                    stopProfitRatio: action.data.stopProfitRatio?action.data.stopProfitRatio:20,
                    stopLossRatio: action.data.stopLossRatio?action.data.stopLossRatio:20,
                    moveStopProfitRatio: action.data.moveStopProfitRatio?action.data.moveStopProfitRatio:20
                }
            }
        }

        default:
            break
    }

    return state
}