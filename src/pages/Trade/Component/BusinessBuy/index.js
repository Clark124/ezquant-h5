
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate, } from 'react-router-dom'
import { ActionSheet, DatePicker, Button, Dialog, Modal, Toast, Radio } from 'antd-mobile-v5'
import moment from 'moment'
import './index.scss'

import { orderInput, currentPositionList, getQuote, timeOrderInput } from '../../../../service/traderoom'
import { setCurrentPosition } from '../../actions'
import arrow_icon from '../../../../asstes/images/grarrow.png'
import Loading from '../../../../components/Loading'

let currentPositionArr = []


function Business(props) {
    const navigate = useNavigate()
    const [price, setPrice] = useState(props.quote.last_px)
    const [profitPrice, setProfitPrice] = useState("")
    const [lossPrice, setLossPrice] = useState("")
    const [count, setCount] = useState(100)
    const [visibleTypeModal, seVisibleTypeModal] = useState(false)
    const [typeIndex, setTypeIndex] = useState(1)
    const [typeValue, setTypeValue] = useState('限价')
    const [visibleStartDate, setVisibleStartDate] = useState(false)
    const [startDateValue, setStartDateValue] = useState('请选择开始时间')
    const [visibleEndDate, setVisibleEndDate] = useState(false)
    const [endDateValue, setEndDateValue] = useState('请选择截止时间')
    const [showLoading, setShowLoading] = useState(false)
    const [positionList, setPositionList] = useState([])
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0)
    const [currentPosition, setCurrentPosition] = useState([])

    const now = new Date()

    const TypeModalList = [
        {
            text: '限价', key: 1, onClick: () => {
                setTypeValue('限价')
                setTypeIndex(1)
                seVisibleTypeModal(false)
            }
        },
        {
            text: '市价', key: 2, onClick: () => {
                setTypeValue('市价')
                setTypeIndex(2)
                seVisibleTypeModal(false)
            }
        },
        {
            text: '高级限价', key: 3, onClick: () => {
                setTypeValue('高级限价')
                setTypeIndex(3)
                seVisibleTypeModal(false)
            }
        },
        {
            text: '高级市价', key: 4, onClick: () => {
                setTypeValue('高级市价')
                setTypeIndex(4)
                seVisibleTypeModal(false)
            }
        },
    ]

    //当前股票可买
    const canBuyNumber = Math.floor(props.account.Available / (price))


    useEffect(() => {
        setPrice(props.quote.last_px)
    }, [props.quote.prod_code])

    useEffect(() => {
        getCurrentPositionList()
    }, [])
    useEffect(() => {
        window.tcpSocket.addEventListener('message', refreshCurrentPositionList);
    }, [])

    function refreshCurrentPositionList(event) {
        const data = event.data
        const ret = JSON.parse(data)

        //期货 当前仓位 更新盈亏 数量
        if (ret.msgType === 'StrategyPositionGather') {
            futCurrentPosition(ret.data)
        }

        if (ret.msgType === 'CThostFtdcTradeField') {
            getCurrentPositionList()
        }


    }

    const futCurrentPosition = (data) => {
        currentPositionArr = currentPositionArr.map((item) => {
            data.forEach(newItem => {
                if (newItem.releaseId === item.releaseId && item.b_S === newItem.b_S) {
                    item.accumulatePositionPL = newItem.accumulatePositionPL
                    item.volume = newItem.volume
                }
            })
            return item
        })
        setCurrentPosition(currentPositionArr)
    }

    //当前仓位
    const getCurrentPositionList = () => {
        const accountInfo = props.account
        const data = {
            'ctp.userId': accountInfo.AccountID,
            'ctp.brokerId': accountInfo.BrokerID,
            instrumentId: props.quote.prod_code
        }
        currentPositionList(data).then(res => {
            currentPositionArr = res.strategyPositionList.filter(item => item.volume > 0)
            setCurrentPosition(currentPositionArr)
            // props.setCurrentPosition(res.strategyPositionList.filter(item => item.volume > 0))
        })
    }

    const addCount = () => {
        let currentCount = Number(count) + 100
        const allPrice = currentCount * price
        if (allPrice > props.account.Available) {
            return
        }
        setCount(currentCount)
    }

    const reduceCount = () => {
        if (Number(count) - 100 <= 0) {
            return
        }
        let currentCount = Number(count) - 100
        setCount(currentCount)
    }

    const addPrice = () => {
        let currentPrice = Number(price) + 0.01
        setPrice(Number(currentPrice.toFixed(2)))
    }

    const reducePrice = () => {
        let currentPrice = Number(price) - 0.01
        if (currentPrice <= 0) {
            return
        }
        setPrice(Number(currentPrice.toFixed(2)))
    }

    const onGetquote = (callback) => {
        getQuote({ prod_code: props.stockCode }).then(res => {
            let value
            if (res && res[0]) {
                value = res[0]
            } else if (res.data && res.data[0]) {
                value = res.data[0]
            } else {
                return
            }

            const canBuyHigh = value.offer_grp.split(',')[12]
            const canBuyLow = value.bid_grp.split(',')[12]
            callback({ canBuyHigh, canBuyLow })


        })
    }

    const confirmBuy = () => {
        const verificateRes = verificateNum()
        if (!verificateRes) {
            return
        }
        Dialog.confirm({
            title: "下单提示",
            content: "请确认参数，谨慎下单",
            onConfirm: () => {

                if (typeIndex === 1 || typeIndex === 2) { //普通单
                    const accountInfo = props.account
                    const data = {
                        'ctp.userId': accountInfo.AccountID,
                        'ctp.brokerId': accountInfo.BrokerID,
                        direction: 0,
                        open: 0,
                        volume: count,
                        instrumentId: props.quote.prod_code,
                        'requestId': 0,
                        'ctp.period': 5,
                        'ctp.releaseId': "",
                        signalId: 0,
                        retainHangorder: true,
                    }

                    if (typeIndex === 1) { //限价
                        data.price = price
                        setShowLoading(true)
                        orderInput(data).then(res => {
                            setShowLoading(false)
                            if(res&&res.fail){
                                Toast.show({
                                    icon:"fail",
                                    content:res.fail
                                })
                            }
                            if(res.response_status==='0'){
                                Toast.show({
                                    icon:"success",
                                    content:"挂单成功"
                                })
                            }
                        })
                    } else {
                        setShowLoading(true)
                        onGetquote((price) => {
                            data.price = price.canBuyHigh
                            orderInput(data).then(res => {
                                setShowLoading(false)
                                if(res.response_status==='0'){
                                    Toast.show({
                                        icon:"success",
                                        content:"挂单成功"
                                    })
                                }
                                if(res&&res.fail){
                                    Toast.show({
                                        icon:"fail",
                                        content:res.fail
                                    })
                                }
                            })

                        })

                    }
                } else if (typeIndex === 3 || typeIndex === 4) { //高级单
                    const accountInfo = props.account
                    const data = {
                        'ctp.userId': accountInfo.AccountID,
                        'ctp.brokerId': accountInfo.BrokerID,
                        direction: 0,
                        open: 0,
                        volume: count,
                        instrumentId: props.quote.prod_code,
                        'requestId': 0,
                        'ctp.period': 5,
                        'ctp.releaseId': "",
                        signalId: 0,
                        retainHangorder: true,
                        executeStartTime: startDateValue !== '请选择开始时间' ? moment(startDateValue, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss') : "",
                        executeEndTime: endDateValue !== '请选择截止时间' ? moment(endDateValue, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss') : "",
                        stlPrice: lossPrice,
                        stpPrice: profitPrice,
                    }
                    if (moment(startDateValue) > moment(endDateValue)) {
                        Modal.alert(({
                            content: "开始时间不能超过结束时间"
                        }))
                        return
                    }
                    if (typeIndex === 3) {
                        if (profitPrice && (profitPrice < price)) {
                            Toast.show({
                                icon: 'fail',
                                content: '止盈价不能低于下单价',
                            })
                            return
                        }
                        if (lossPrice && (lossPrice > price)) {
                            Toast.show({
                                icon: 'fail',
                                content: '止损价不能高于下单价',
                            })
                            return
                        }

                        data.price = price
                        setShowLoading(true)
                        timeOrderInput(data).then(res => {
                            setShowLoading(false)
                            if(res&&res.fail){
                                Toast.show({
                                    icon:"fail",
                                    content:res.fail
                                })
                            }
                        })
                    } else {
                        setShowLoading(true)
                        onGetquote((price) => {
                            if (profitPrice && (profitPrice < price.canBuyHigh)) {
                                Toast.show({
                                    icon: 'fail',
                                    content: '止盈价不能低于下单价',
                                })
                                return
                            }
                            if (lossPrice && (lossPrice > price.canBuyHigh)) {
                                Toast.show({
                                    icon: 'fail',
                                    content: '止损价不能高于下单价',
                                })
                                return
                            }
                            data.price = price.canBuyHigh
                            timeOrderInput(data).then(res => {
                                setShowLoading(false)
                                if(res&&res.fail){
                                    Toast.show({
                                        icon:"fail",
                                        content:res.fail
                                    })
                                }
                            })

                        })
                    }

                }
            }
        })
    }


    //验证可买数量
    const verificateNum = () => {
        if (price <= 0) {
            Toast.show({
                icon: "fail",
                content: "下单价格有误"
            })
            return
        }
        if (!count || Number(count) < 0) {
            Toast.show({
                icon: "fail",
                content: "下单数量有误"
            })
            return
        }
        if (Number(count) % 100 !== 0) {
            Toast.show({
                icon: "fail",
                content: "买入数量需为100的整数倍"
            })
            return
        }
        let currentCount = Number(count) + 100
        const allPrice = currentCount * price
        if (allPrice > props.account.Available) {
            Toast.show({
                icon: "fail",
                content: "下单数量超过可买数量"
            })
            return
        }

        return true

    }

    const onChangeCount = (e) => {
        setCount(e)
    }

    return (
        <div className="business-wrapper">
            <div className="search-result" onClick={() => navigate('/trade/search')}>
                <span style={{ marginRight: 10 }}>{props.quote.prod_code}</span>
                <span>{props.quote.prod_name}</span>
            </div>
            <div className="quote-wrapper">
                <div className="left">
                    <div className="order-type" onClick={() => seVisibleTypeModal(true)}>
                        <div>订单类型：</div>
                        <div className="value">
                            <span>{typeValue}</span>
                            <img src={arrow_icon} alt="" />
                        </div>


                    </div>

                    <ActionSheet
                        visible={visibleTypeModal}
                        actions={TypeModalList}
                        onClose={() => seVisibleTypeModal(false)}
                    />
                    <div style={{ display: 'flex', justifyContent: "space-between", marginBottom: 10 }}>
                        <div className="current-price">
                            <span className="text">总资金：</span>
                            <span className="value">{props.account.Balance.toFixed(2)}</span>
                        </div>
                        <div className="current-price" style={{ marginLeft: 20 }}>
                            <span className="text">可用资金：</span>
                            <span className="value">{props.account.Available.toFixed(2)}</span>

                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <div className="current-price">
                            <span className="text">当前价：</span>
                            <span className="value">{props.quote.last_px}</span>
                        </div>
                        {/* <div className="high-low">
                            <span className="text">跌停：</span>
                            <span className="value green">5.92</span>
                            <span className="text">涨停：</span>
                            <span className="value red">7.24</span>
                        </div> */}
                    </div>

                    {typeIndex === 1 || typeIndex === 3 ?
                        <div className="change-price-wrapper">
                            <span className="text">价格：</span>
                            <span className="add-price-btn" onClick={reducePrice}>-</span>
                            <input type="number" className="price-input" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                            <span className="add-price-btn" onClick={addPrice}>+</span>
                        </div> : null
                    }

                    {typeIndex === 3 || typeIndex === 4 ?
                        <div className="change-price-wrapper">
                            <span className="text">止盈价：</span>
                            {/* <span className="add-price-btn">-</span> */}
                            <input type="number" className="price-input" value={profitPrice} onChange={(e) => { setProfitPrice(e.target.value) }} />
                            {/* <span className="add-price-btn">+</span> */}
                        </div> : null
                    }
                    {typeIndex === 3 || typeIndex === 4 ?
                        <div className="change-price-wrapper">
                            <span className="text">止损价：</span>
                            {/* <span className="add-price-btn">-</span> */}
                            <input type="number" className="price-input" value={lossPrice} onChange={(e) => { setLossPrice(e.target.value) }} />
                            {/* <span className="add-price-btn">+</span> */}
                        </div> : null
                    }

                    {typeIndex === 3 || typeIndex === 4 ?
                        <div className="select-date-wrapper">
                            <div className="select-date">
                                <span style={{ width: "80px" }}>开始时间：</span>
                                <Button
                                    onClick={() => {
                                        setVisibleStartDate(true)
                                    }}
                                >
                                    {startDateValue}
                                </Button>
                                <DatePicker
                                    visible={visibleStartDate}
                                    onClose={() => {
                                        setVisibleStartDate(false)
                                    }}
                                    defaultValue={now}
                                    precision='minute'
                                    onConfirm={val => {
                                        setStartDateValue(moment(val).format('YYYY-MM-DD HH:mm'))
                                    }}
                                />
                            </div>
                            <div className="select-date">
                                <span style={{ width: "80px" }}>截止时间：</span>
                                <Button
                                    onClick={() => {
                                        setVisibleEndDate(true)
                                    }}
                                >
                                    {endDateValue}
                                </Button>
                                <DatePicker
                                    visible={visibleEndDate}
                                    onClose={() => {
                                        setVisibleEndDate(false)
                                    }}
                                    defaultValue={now}
                                    precision='minute'
                                    onConfirm={val => {
                                        setEndDateValue(moment(val).format('YYYY-MM-DD HH:mm'))
                                    }}
                                />
                            </div>
                        </div> : null
                    }






                    <div className="change-price-wrapper">
                        <span className="text">下单数量：</span>
                        <span className="add-price-btn" onClick={reduceCount} >-</span>
                        <input type="number" className="price-input" value={count} onChange={(e) => {
                            onChangeCount(e.target.value)
                        }} />
                        <span className="add-price-btn" onClick={addCount}>+</span>
                    </div>


                    {/* <div className="select-position">
                        <span className="active">1/4</span>
                        <span>1/3</span>
                        <span>1/2</span>
                        <span>全仓</span>
                    </div> */}
                    <div className="can-buy">
                        <span className="text">当前可买：</span>
                        <span>{canBuyNumber}</span>
                    </div>
                    <div className="can-buy">
                        <span className="text">买入金额：</span>
                        <span className="value">{(price * count).toFixed(2)}</span>
                    </div>

                    <div className="current-position-wrapper">
                        <div>当前仓位</div>
                        <div className="current-position-head">
                            <span>来源</span>
                            <span>交易类型</span>
                            <span>数量</span>
                            <span>可卖数量</span>
                            <span>盈亏</span>
                        </div>
                        <div className="current-position-list">

                            {
                                currentPosition.map((item, index) => {
                                    return (
                                        <div className="current-position-item" key={index}>
                                            <span>{item.releaseName}</span>
                                            <span style={item.b_S === 'B' ? { color: 'red' } : { color: 'green' }}>{item.b_S === 'B' ? '买' : '卖'}</span>
                                            <span>{item.volume}</span>
                                            <span>{item.enableVolume}</span>
                                            <span style={item.accumulatePositionPL >= 0 ? { color: 'red' } : { color: 'green' }}>{item.accumulatePositionPL.toFixed(2)}</span>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>




                {/* <div className="right">
                    <div className="current-five-quote">
                        <div className="quote-item">
                            <span>卖5</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                        <div className="quote-item">
                            <span>卖4</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                        <div className="quote-item">
                            <span>卖3</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                        <div className="quote-item">
                            <span>卖2</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                        <div className="quote-item">
                            <span>卖1</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                    </div>

                    <div className="current-five-quote" style={{marginTop:50}}>
                        <div className="quote-item">
                            <span>买1</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                        <div className="quote-item">
                            <span>买2</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                        <div className="quote-item">
                            <span>买3</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                        <div className="quote-item">
                            <span>买4</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                        <div className="quote-item">
                            <span>买5</span>
                            <span>6.65</span>
                            <span>1810</span>
                        </div>
                    </div>

                </div> */}
            </div>

            <div className="footer-btn">
                <div onClick={confirmBuy}>买入下单</div>
                {/* <div style={{ background: '#999' }}>重置</div> */}
            </div>
            {showLoading ? <Loading /> : null}

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        stockCode: state.traderoom.code,
        quote: state.traderoom.quote,
        account: state.traderoom.account,
        currentPositionList: state.traderoom.currentPositionList
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentPosition: (data) => {
            dispatch(setCurrentPosition(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Business)