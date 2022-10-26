import {
    CHANGE_STOCK_DATA, CHANGE_QUOTE_DATA, SET_ACCOUNT, CHANGE_PERIOD, CHANGE_CODE, CHANGE_FAV, SET_ACCOUNT_LIST, SET_CURRENT_POSITION,
    SET_MY_STRATEGY_LIST, SET_STRATEGY_INDEX, SET_CURRENT_ACCOUNT_ID, UPDATE_TRUST_DATA, CHANGE_CHART_TYPE
} from './actionTypes'

function randomString(length) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
        result += str[Math.floor(Math.random() * str.length)];
    return result;
}

const defaultState = {
    code: "000651.SZ",
    period: 6,
    isFavor: false,
    stockDate: [],
    quote: { prod_name: "--", prod_code: "--", last_px: "--", px_change: '--', px_change_rate: '--', high_px: '--', low_px: '--' },
    marketType: 0, //0股票，1期货
    account: { Balance: 0, Available: 0 },
    accountList: [],
    currentAccountId: "",
    currentFutAccount: {},
    socketUuid: "",
    // profitLine:[{name:'开仓价',price:60,},{name:'止盈价',price:65,},{name:'止损价',price:55,}], //开仓价 止盈 止损  数据列表
    profitLine: [],
    currentDirection: 0,
    positionId: 0,
    currentPosition: {},
    currentPositionList: [],
    lastTime: "",
    signalList: [],
    randomString: randomString(10),
    favList: [], //自选列表
    myStrategyList: [],
    strategyIndex: 0,
    isMinChart: false,
    trustData: {
        period: 6,
        periodText: '1日',
        capital: 100000,
        trustName: "",
        riskIndex: 0,
        profitRatio: 20,
        lossRatio: 20,
        profitTick: 1,
        lossTick: 1,
        discribe: "",
        weixinNotice: false,
        systemNotice: true,
        isOrder: 1,
        isPublish: false,

    }
}


export default (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_CODE: {
            return {
                ...state, code: action.data
            }
        }
        case CHANGE_STOCK_DATA: {
            return {
                ...state, stockDate: action.data
            }
        }

        case CHANGE_QUOTE_DATA: {
            return {
                ...state, quote: { ...state.quote, ...action.data, }
            }
        }

        case SET_ACCOUNT: {
            return {
                ...state, account: action.data
            }
        }

        case SET_ACCOUNT_LIST: {
            return {
                ...state, accountList: action.data
            }
        }

        case SET_CURRENT_ACCOUNT_ID: {
            return {
                ...state, currentAccountId: action.data
            }
        }

        case CHANGE_PERIOD: {
            return {
                ...state, period: action.data
            }
        }

        case CHANGE_FAV: {
            return {
                ...state, favList: action.data
            }
        }

        case SET_MY_STRATEGY_LIST: {
            return {
                ...state, myStrategyList: action.data
            }
        }

        case SET_STRATEGY_INDEX: {
            return {
                ...state, strategyIndex: action.data
            }
        }

        case UPDATE_TRUST_DATA: {
            return {
                ...state, trustData: { ...state.trustData, [action.data.type]: action.data.value }
            }
        }

        case CHANGE_CHART_TYPE: {
            return {
                ...state, isMinChart: action.data
            }
        }

        case SET_CURRENT_POSITION: {
            return {
                ...state, currentPositionList: action.data
            }
        }

        default:
            break
    }

    return state
}