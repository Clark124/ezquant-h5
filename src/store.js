import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import homeReducer from './pages/Home/reducer'
import indexReducer from './pages/Index/reducer'
import traderoomReducer from './pages/Trade/reducer'
import pickStockReducer from './pages/PickStock/reducer'
import composeReducer from './pages/CombinationMy/reducer'

const reducer = combineReducers({
    home:homeReducer,
    index:indexReducer,
    traderoom:traderoomReducer,
    pickStock:pickStockReducer,
    compose:composeReducer,
  })
  
  const middlewares = [thunkMiddleware];
  if (process.env.NODE_ENV !== 'production') {
      // middlewares.push(immutable())
  }
  
  const storeEnhancers = process.env.NODE_ENV !== 'production' ?
      composeWithDevTools(
          applyMiddleware(...middlewares),
      ) :
      applyMiddleware(...middlewares);
  
  
  const store = createStore(reducer,{},storeEnhancers)
  export default store;