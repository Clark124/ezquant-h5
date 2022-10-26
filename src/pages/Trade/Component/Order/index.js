import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DatePicker, Radio, Dialog, Toast } from 'antd-mobile-v5'
import './index.scss'
import moment from 'moment'

import { queryOrder, TimeOrderList, closePositionTimeOrder ,getPriceTick,getQuote1,updateCancelOrderPrice} from '../../../../service/traderoom'
import { cancelOrder } from '../../../../service/traderoom'

function Order(props) {
    const navigate = useNavigate()
    const [currentAllIndex, setCurrentAllIndex] = useState(0)
    const [tabIndex, setTabIndex] = useState(0)
    const [orderList, setOrderList] = useState([])
    const [timeOrderList, setTimeOrderList] = useState([])
    const [visibleEdit, setVisibleEdit] = useState(false)
    const [showDialog,setShowDialog] = useState(false)
    const [updatePirceValue,setUpdatePirceValue] = useState('')
    const [orderItem,setOrderItem] = useState("")
    const [minPrice,setMinPrice] = useState("")


    useEffect(() => {
        let tabIndex = localStorage.getItem("orderTabIndex")
        if (tabIndex) {
            tabIndex = JSON.parse(tabIndex)
            setTabIndex(tabIndex)
            if (tabIndex === 0) {
                onQueryOrder(props.account)
            } else {
                onQueryTimeOrder(props.account)
            }
        } else {
            onQueryOrder(props.account)
        }
        onGetPriceTick()
    }, [])

    //获取最小变动价
    const onGetPriceTick=()=> {
        getPriceTick({ symbol: props.code }).then(res => {
            setMinPrice(res)
        })
    }

    //查询撤单列表
    const onQueryOrder = (account) => {
        const data = {
            'ctp.userId': account.AccountID,
            'ctp.brokerId': account.BrokerID
        }

        queryOrder(data).then(res => {
            const dataList = Object.values(res).filter(
                item => typeof item === 'object'
            )
            const orderIdList = Object.keys(res).filter(item => item.includes('#'))
            let orderList = dataList
            orderList.forEach((item, index) => {
                item.orderId = orderIdList[index]
            })

            setOrderList(orderList)
            // setCurrentOrderList(current)
        })

    }

    //查询高级定单列表
    const onQueryTimeOrder = (account) => {
        const userId = account.AccountID
        const data = {
            userId: userId,
        }
        TimeOrderList(data).then(res => {
            if (res.response_status === '0') {
                setOrderList(res.data)
            }
        })
    }

    //撤单
    const onCancelOrder = (item) => {
        Dialog.confirm({
            content: '确定要撤单吗？',
            onConfirm: () => {
                const data = {
                    OrderSysID: item.OrderSysID.trim(),
                    OrderRef: item.OrderRef,
                    InvestorID: item.InvestorID,
                    InstrumentID: item.InstrumentID,
                    ExchangeID: item.ExchangeID,
                    FrontID: item.FrontID,
                    SessionID: item.SessionID,
                    'ctp.userId': props.account.AccountID,
                    'ctp.brokerId': props.account.BrokerID,
                    'ctp.tradeUnitId': item.tradeUnitId
                }

                cancelOrder(data).then(res => {
                    if (res.response_status === '0') {
                        Toast.show({
                            icon: 'success',
                            content: '操作成功',
                        })
                        onQueryOrder(props.account)
                    } else {
                        Toast.show({
                            icon: 'fail',
                            content: '撤单失败',
                        })
                    }
                }).catch(err => {
                    Toast.show({
                        icon: 'fail',
                        content: '撤单失败',
                    })
                })
            }
        })

    }

    const showEditModal = (item) => {
        localStorage.setItem('editTimeOrder', JSON.stringify(item))
        navigate('/trade/timeOrderEdit')
    }

    const closePosition = (item) => {
        Dialog.confirm({
            title: "确定要平仓吗？",
            onConfirm: () => {
                Toast.show({
                    icon: 'loading',
                    content: '加载中…',
                    duration: 0,
                    maskClickable: false
                })
                closePositionTimeOrder({ id: item.id }).then(res => {
                    Toast.clear()
                    onQueryTimeOrder(props.account)
                    Toast.show({
                        icon: "success",
                        content: "平仓成功"
                    })
                }).catch(err => {
                    Toast.clear()
                })
            }
        })
    }

    //修改挂单价格
    const confirmUpdatePirce = () => {
       
        const count = Number(updatePirceValue) / minPrice
        const num = String(count).indexOf('.') + 1
        if (num > 0) {
            Dialog.confirm({
                content: "输入价格的最小变动价不正确"
            })
            return
        }

        const userId = props.account.AccountID
        const brokerId = props.account.BrokerID
        const data = {
            'ctp.brokerId': brokerId,
            'ctp.userId': userId,
            orderKey: orderItem.orderId,
            price: updatePirceValue
        }

        Toast.show({
            icon: 'loading',
            content: '托管中…',
            duration: 0,
            maskClickable:false
        })
        getQuote1({
            'ctp.userId': userId,
            'ctp.brokerId': brokerId,
            'ctp.instrument': orderItem.InstrumentID,
            'ctp.sub': true
        }).then(res => {

            const LowerLimitPrice = res[orderItem.InstrumentID].LowerLimitPrice
            const UpperLimitPrice = res[orderItem.InstrumentID].UpperLimitPrice

            if (Number(updatePirceValue) < LowerLimitPrice) {
                Toast.show({
                    icon:"fail",
                    content:"修改的价格不能低于跌停价"
                })
               
                return
              
            } else if (Number(updatePirceValue) > UpperLimitPrice) {
                Toast.show({
                    icon:"fail",
                    content:"修改的价格不能高于涨停价"
                })
               
                return
            } else {
                updateCancelOrderPrice(data).then(res => {
                    Toast.clear()
                    if(res.fail){
                        Toast.show({
                            icon:"fail",
                            content:res.fail
                        })
                    }else{
                        onQueryOrder(props.account)
                        Toast.show({
                            icon:"success",
                            content:'修改成功'
                        })
                      
                    }
                    setShowDialog(false)
                  
                }).catch(() => {
                    Toast.clear()
                })
            }
        })
    }

    let currentDataList = []

    if (currentAllIndex === 0) {
        if (tabIndex === 0) {
            currentDataList = orderList.filter(item => item.InstrumentID === props.quote.prod_code)
        } else {
            currentDataList = orderList.filter(item => item.instrumentId === props.quote.prod_code)
        }

    } else {
        currentDataList = orderList
    }


    return (
        <div className="order-wrapper">
            <div className="order-head">
                <div className="tab">
                    <span className={tabIndex === 0 ? "active" : ""} onClick={() => {
                        setTabIndex(0)
                        onQueryOrder(props.account)
                        localStorage.setItem("orderTabIndex", JSON.stringify(0))
                    }}>订单</span>
                    <span className={tabIndex === 1 ? "active" : ""} onClick={() => {
                        setTabIndex(1)
                        onQueryTimeOrder(props.account)
                        localStorage.setItem("orderTabIndex", JSON.stringify(1))
                    }}>高级订单</span>
                </div>
                <div className="current-all">
                    <Radio.Group value={currentAllIndex} onChange={(e) => {
                        setCurrentAllIndex(e)

                    }}>
                        <Radio value={0} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '10px' }}>{props.quote.prod_name}</Radio>
                        <Radio value={1} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '10px' }}>全部股票</Radio>
                    </Radio.Group>
                </div>

            </div>

            {tabIndex === 0 ?
                <div className="order-list">
                    {currentDataList.map((item, index) => {
                        return (
                            <div className="order-item" key={index}>
                                <div className="code-date">
                                    <span className="code-name">{item.contractName} {item.InstrumentID}</span>
                                    <span className="cancel-order-btn" onClick={() => onCancelOrder(item)}>撤单</span>
                                </div>
                                <div className="info-line">
                                    <div>
                                        <span>买卖</span>
                                        <span className="red"> {item.Direction === '0' ? '买' : '卖'}</span>
                                    </div>
                                    <div>
                                        <span>数量</span>
                                        <span>{item.VolumeTotalOriginal}</span>
                                    </div>
                                </div>
                                <div className="info-line">
                                    <div>
                                        <span>委托价格</span>
                                        <span className='update-price' onClick={() => {
                                            setUpdatePirceValue("")
                                            setShowDialog(true)
                                            setOrderItem(item)
                                        }}>{Number(item.LimitPrice).toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span>来源</span>
                                        <span>{item.source}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}


                </div> : null
            }
            {tabIndex === 1 ?
                <div className="order-list">
                    {currentDataList.map((item, index) => {
                        let status = ""
                        switch (item.ccorderStatus) {
                            case 0:
                                status = '未触发'
                                break;
                            case 1:
                                status = '已下开仓单'
                                break;
                            case 2:
                                status = '开仓已完成'
                                break;
                            case 3:
                                status = '已下平仓单'
                                break;
                            case 4:
                                status = '平仓已完成'
                                break;
                            case 5:
                                status = '撤销此单'
                                break;
                            case 6:
                                status = '过期未触发'
                                break;
                            case 7:
                                status = '开仓单撤单中'
                                break;
                            case 8:
                                status = '平仓单撤单中'
                                break;
                            default:
                                status = '未触发'
                        }

                        let isShowEditBtn = false
                        if (item.ccorderStatus === 0 || item.ccorderStatus === 1 || item.ccorderStatus === 2) {
                            isShowEditBtn = true
                        }
                        let isShowCloseBtn = false
                        if (item.ccorderStatus === 2) {
                            isShowCloseBtn = true
                        }
                        return (
                            <div className="order-item" key={index}>
                                <div className="code-date">
                                    <span className="code-name">{item.contractName} {item.instrumentId}</span>
                                    {/* <span className="date">{item.createDatetime}</span> */}
                                </div>
                                <div className="info-line">
                                    <div>
                                        <span>买卖</span>
                                        <span className="red"> {item.direction === 48 ? '买' : '卖'}</span>
                                    </div>
                                    <div>
                                        <span>数量</span>
                                        <span>{item.volumeOpenOriginal}</span>
                                    </div>
                                </div>
                                <div className="info-line">
                                    <div >
                                        <span>委托价格</span>
                                        <span>{item.limitPrice}</span>
                                    </div>
                                    <div >
                                        <span>状态</span>
                                        <span>{status}</span>
                                    </div>
                                </div>
                                <div className="info-line">
                                    <div>
                                        <span>止盈价</span>
                                        <span >{item.stpPrice}</span>
                                    </div>
                                    <div>
                                        <span>止损价</span>
                                        <span>{item.stlPrice}</span>
                                    </div>
                                </div>


                                <div className="start-end-date">
                                    <span className="text">开始时间：</span>
                                    <span>{item.executeDatetime}</span>
                                    {/* <DatePicker
                                        visible={false}
                                        value={new Date()}
                                    >
                                        {value => moment(value).format('YYYY-MM-DD HH:mm')}
                                    </DatePicker> */}
                                </div>
                                <div className="start-end-date">
                                    <span className="text">截止时间：</span>
                                    <span>{item.expiryDatetime}</span>
                                    {/* <DatePicker
                                        visible={false}
                                        value={new Date()}
                                    >
                                        {value => moment(value).format('YYYY-MM-DD HH:mm')}
                                    </DatePicker> */}

                                </div>
                                <div className='time-order-item-btn'>
                                    <span className="edit" style={!isShowEditBtn ? { display: 'none' } : null} onClick={() => showEditModal(item)}>编辑</span>
                                    <span style={!isShowCloseBtn ? { display: 'none' } : null} className="close-position" onClick={() => closePosition(item)}>平仓</span>
                                </div>


                            </div>
                        )

                    })}

                </div> : null
            }
            {currentDataList.length === 0 ?
                <div className="no-data">暂无订单</div> : null
            }

            <Dialog
                visible={showDialog}
                title={'修改下单价格'}
                content={(
                    <div className="search-modal">
                        <input className='update-price-input' type="number" placeholder="请输入期望的价格" onChange={(e) => setUpdatePirceValue(e.target.value)} value={updatePirceValue}/>
                       
                    </div>
                )}
                closeOnMaskClick={true}
                onClose={() => {
                    setShowDialog(false)
                }}
                actions={[
                    [
                        {
                            key:'confirm',
                            text:"确定",
                            onClick:()=>{
                                confirmUpdatePirce()
                            }
                        },
                        {
                            key:'cancel',
                            text:"取消",
                            onClick:()=>{
                                setShowDialog(false)
                            }
                        }
                    ]
                    
                ]}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        quote: state.traderoom.quote,
        code: state.traderoom.code,
        account: state.traderoom.account
    };
}
export default connect(mapStateToProps, null)(Order)