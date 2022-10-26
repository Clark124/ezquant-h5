import { CHANGE_TAB } from './actionTypes'

const reducer = (state = {
    selectedTab: 'home'
}, action) => {
    switch (action.type) {
        case CHANGE_TAB: {
            return {
                ...state,
                selectedTab: action.data
            }
        }
        default: {
            return state
        }
    }
}

export default reducer