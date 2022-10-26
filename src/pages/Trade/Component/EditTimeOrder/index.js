import { useEffect, useState } from "react"
import { DatePicker, Button, Toast, Dialog } from 'antd-mobile-v5'
import { useNavigate } from 'react-router-dom'
import moment from "moment"
import './index.scss'
import { updateTimeOrder, } from '../../../../service/traderoom'

export default function EditTimeOrder() {
    const navigate = useNavigate()
    const [visibleStartDate, setVisibleStartDate] = useState(false)
    const [startDateValue, setStartDateValue] = useState('请选择开始时间')
    const [visibleEndDate, setVisibleEndDate] = useState(false)
    const [endDateValue, setEndDateValue] = useState('请选择截止时间')
    const [orderData, setOrderData] = useState({
        limitPrice:"",
        stpPrice:"",
        stlPrice:"",
    })

    const now = new Date()

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem("editTimeOrder"))
        setOrderData(data)
        console.log(data)
    }, [])

    //修改高级订单
    const submitOrderEdit = () => {
        const direction = orderData.direction === 48 ? 0 : 1
        if (direction === 0) {
            if (Number(orderData.stpPrice) && (Number(orderData.stpPrice) < Number(orderData.limitPrice))) {
                Toast.show({
                    icon: "fail",
                    content: "止盈价不能低于下单价"
                })
                return
            }
            if (Number(orderData.stlPrice) && (Number(orderData.stlPrice) > Number(orderData.limitPrice))) {
                Toast.show({
                    icon: "fail",
                    content: "止损价不能高于下单价"
                })
                return
            }
        }

        if (direction === 1) {
            if (Number(orderData.stpPrice) && (Number(orderData.stpPrice) > Number(orderData.limitPrice))) {
                Toast.show({
                    icon: "fail",
                    content: "止盈价不能高于下单价"
                })
                return
            }
            if (Number(orderData.stlPrice) && (Number(orderData.stlPrice) < Number(orderData.limitPrice))) {
                Toast.show({
                    icon: "fail",
                    content: "止损价不能低于下单价"
                })
                return
            }
        }
        const data = {
            cancel: false,
            id: orderData.id,
            price: Number(orderData.limitPrice),
            stlPrice: Number(orderData.stlPrice),
            stpPrice: Number(orderData.stpPrice),
            executeStartTime: orderData.executeDatetime,
            executeEndTime: orderData.expiryDatetime
        }
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            maskClickable:false
        })
        updateTimeOrder(data).then(res => {
            Toast.clear()
            if (res.response_status === '0') {
                Toast.show({
                    icon: "success",
                    content: "修改成功",
                    afterClose: () => {
                        navigate(-1)
                    }
                })

            }
        }).catch(err=>{
            Toast.clear()
        })

    }

    const cancelOrder = () => {
        Dialog.confirm({
            content: "确定要取消该订单吗",
            onConfirm: () => {
                const data = {
                    cancel: true,
                    id: orderData.id,
                }
                Toast.show({
                    icon: 'loading',
                    content: '加载中…',
                    duration: 0,
                    maskClickable:false
                })
                updateTimeOrder(data).then(res => {
                    Toast.clear()
                    if (res.response_status === '0') {
                        Toast.show({
                            icon: "success",
                            content: "撤单成功",
                            afterClose: () => {
                                navigate(-1)
                            }
                        })
                    }
                }).catch(err=>{
                    Toast.clear()
                })
            }
        })

    }

    //是否能修改止盈止损价
    let canEidtPrice = false
    if (orderData.ccorderStatus === 0 || orderData.ccorderStatus === 1 || orderData.ccorderStatus === 2) {
        canEidtPrice = true
    }

    //是否能修改下单价格
    let canUpateOrderPirce = false
    if (orderData.ccorderStatus === 0 || orderData.ccorderStatus === 1) {
        canUpateOrderPirce = true
    }

    return (
        <div className="time-order-edit-wrap">
            <div className="title">修改高级订单</div>
            <div className="input-item">
                <span className="input-text">下单价格：</span>
                <input type="number" className="input-value" placeholder="请输入下单价格" value={orderData.limitPrice}
                    onChange={(e) => setOrderData({ ...orderData, limitPrice: e.target.value })} disabled={!canUpateOrderPirce}
                />
            </div>
            <div className="input-item">
                <span className="input-text">止盈价：</span>
                <input type="number" className="input-value" placeholder="请输入止盈价" value={orderData.stpPrice}
                    onChange={(e) => setOrderData({ ...orderData, stpPrice: e.target.value })} disabled={!canEidtPrice}
                />
            </div>
            <div className="input-item">
                <span className="input-text">止损价：</span>
                <input type="number" className="input-value" placeholder="请输入止损价" value={orderData.stlPrice}
                    onChange={(e) => setOrderData({ ...orderData, stlPrice: e.target.value })} disabled={!canEidtPrice}
                />
            </div>
            <div className="input-item">
                <span className="input-text">开始时间：</span>
                <Button
                    onClick={() => {
                        setVisibleStartDate(true)
                    }}
                >
                    {orderData.executeDatetime}
                </Button>
                <DatePicker
                    visible={visibleStartDate}
                    onClose={() => {
                        setVisibleStartDate(false)
                    }}
                    value={moment(orderData.executeDatetime, 'YYYY-MM-DD HH:mm:ss').toDate()}
                    precision='minute'
                    onConfirm={val => {
                        setOrderData({ ...orderData, executeDatetime: moment(val).format('YYYY-MM-DD HH:mm:ss') })
                    }}
                    disabled={orderData.ccorderStatus !== 0}
                />

            </div>
            <div className="input-item">
                <span className="input-text">截止时间：</span>
                <Button
                    onClick={() => {
                        setVisibleEndDate(true)
                    }}
                >
                    {orderData.expiryDatetime}
                </Button>
                <DatePicker
                    visible={visibleEndDate}
                    onClose={() => {
                        setVisibleEndDate(false)
                    }}
                    value={moment(orderData.expiryDatetime, 'YYYY-MM-DD HH:mm:ss').toDate()}
                    precision='minute'
                    onConfirm={val => {
                        setOrderData({ ...orderData, expiryDatetime: moment(val).format('YYYY-MM-DD HH:mm:ss') })
                    }}
                    disabled={orderData.ccorderStatus !== 0}
                />
            </div>

            <div className="time-order-modal-btn-wrapper">
                <span className="edit" onClick={submitOrderEdit}>修改</span>
                <span className="cancel" onClick={cancelOrder} style={(orderData.ccorderStatus === 0 || orderData.ccorderStatus === 1) ? {} : { display: "none" }}>取消订单</span>
            </div>
        </div>
    )
}