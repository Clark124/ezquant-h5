import {
    CHANGE_MARKET, CANCEL_MARKET, SELECTED_INDICATE, CHOOSE_INDICATE, UPDATE_INDICATE, SET_SELECTED_LIST, INIT_PICKSTOCK, SET_INDICATE_ARR,
    SET_START_DATE_VALUE, SET_END_DATE_VALUE, SELECTED_STRATEGY, CHOOSE_MARKET, SET_POOL_LIST, SET_POOL_ID, SET_POOL_SELECT_CODE, SET_INDICATE,
    SET_MARKET_ARR, SET_MARKET_OBJ
} from './actionTypes'
import moment from 'moment'

const defaultState = {
    market: [],
    industry: [],
    concept: [],
    area: [],
    indicates: {

    },
    indicateArr: [],
    marketArr: [],
    startDateValue: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    endDateValue: moment().format('YYYY-MM-DD'),
    selectedStrategyId: "",
    selectedStrategy: {},
    poolList: [],
    selectedPoolId: [],
    poolSelectCode: [],


}

export default (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_MARKET: {
            return {
                ...state, [action.data.type]: action.data.data
            }
        }
        case CANCEL_MARKET: {
            return {
                ...state, [action.data.type]: state[action.data.type].filter(item => item !== action.data.data),
                marketArr: state.marketArr.filter(item => item.name !== action.data.data)
            }
        }

        case SELECTED_INDICATE: {
            let indicate = JSON.parse(JSON.stringify(state.indicates))
            indicate[action.data.type] = action.data.data

            return {
                ...state, indicates: indicate,
            }
        }

        case SET_INDICATE_ARR: {
            return {
                ...state, indicates: action.data,
            }
        }

        case CHOOSE_INDICATE: {
            let indicateArr = JSON.parse(JSON.stringify(state.indicateArr))
            if (action.data.checked) {
                indicateArr.push(action.data.value)
            } else {
                indicateArr = indicateArr.filter(item => item.value !== action.data.value.value)
            }

            return {
                ...state, indicateArr: indicateArr,
            }
        }

        case SET_INDICATE: {
            return {
                ...state, indicateArr: action.data,
            }
        }

        case CHOOSE_MARKET: {
            let marketArr = JSON.parse(JSON.stringify(state.marketArr))
            if (action.data.checked) {
                marketArr.push(action.data.value)
            } else {
                marketArr = marketArr.filter(item => item.name !== action.data.value.name)
            }

            return {
                ...state, marketArr: marketArr,
            }
        }
        case SET_MARKET_ARR: {
            return {
                ...state, marketArr: action.data,
            }
        }

        case SET_MARKET_OBJ: {
            return {
                ...state, ...action.data
            }
        }



        case UPDATE_INDICATE: {
            let indicateArr = JSON.parse(JSON.stringify(state.indicateArr))
            indicateArr[action.data.index] = action.data.value
            return {
                ...state, indicateArr: indicateArr,
            }
        }
        case SET_SELECTED_LIST: {
            return {
                ...state, indicateArr: action.data,
            }
        }
        case SET_START_DATE_VALUE: {
            return {
                ...state, startDateValue: action.data
            }
        }
        case SET_END_DATE_VALUE: {
            return {
                ...state, endDateValue: action.data
            }
        }
        case SELECTED_STRATEGY: {

            return {
                ...state, selectedStrategyId: action.data.id, selectedStrategy: action.data.strategy
            }
        }
        case SET_POOL_LIST: {
            return {
                ...state, poolList: action.data
            }
        }
        case SET_POOL_ID: {
            return {
                ...state, selectedPoolId: [...action.data]
            }
        }

        case SET_POOL_SELECT_CODE: {
            return {
                ...state, poolSelectCode: action.data
            }
        }

        case INIT_PICKSTOCK: {
            return {
                market: [],
                industry: [],
                concept: [],
                area: [],
                indicates: {

                },
                indicateArr: [],
                marketArr: [],
                startDateValue: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                endDateValue: moment().format('YYYY-MM-DD'),
                selectedStrategyId: "",
                selectedStrategy: {},
                poolList: [],
                selectedPoolId: [],
                poolSelectCode: [],
            }
        }

    }

    return state
}