
import { useState } from 'react';
import { Radio, Checkbox, TextArea, Button, DatePicker, ActionSheet, Toast, Dialog } from 'antd-mobile-v5'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import moment from 'moment';
import { connect } from 'react-redux'

import arrow_icon from '../../../../asstes/images/grarrow.png'

import { testStrategy, risksettingNext, updateCombination } from '../../../../service/compose'
import { changeRiskSetValue } from '../../actions'

function RiskControl(props) {
    let navigate = useNavigate();
    const [startDateValue, setStartDateValue] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'))
    const [endDateValue, setEndDateValue] = useState(moment().format('YYYY-MM-DD'))
    const [visibleStartDate, setVisibleStartDate] = useState(false)
    const [visibleEndDate, setVisibleEndDate] = useState(false)

    const [visibleAction, setVisibleAction] = useState(false)
    const [costValue, setCostValue] = useState({ text: '万分之五', value: 0.0005 })

    const costActions = [
        {
            text: '万分之五', key: 0.0005, onClick: (e) => {
                setCostValue({ text: '万分之五', value: 0.0005 })
                setVisibleAction(false)
            },
        },
        {
            text: '万分之八', key: 0.0008, onClick: (e) => {
                setCostValue({ text: '万分之八', value: 0.0008 })
                setVisibleAction(false)
            },
        },
        {
            text: '千分之一', key: 0.001, onClick: (e) => {
                setCostValue({ text: '千分之一', value: 0.001 })
                setVisibleAction(false)
            },
        },
        {
            text: '千分之一点五', key: 0.015, onClick: (e) => {
                setCostValue({ text: '千分之一点五', value: 0.015 })
                setVisibleAction(false)
            },
        },
    ]

    const onBacktest = () => {
        if (props.riskSet.composeName.trim() === "") {
            Toast.show({
                icon: "fail",
                content: "组合名称不能为空"
            })
            return
        }
        if (props.riskSet.styles.length === 0) {
            Toast.show({
                icon: "fail",
                content: "组合风格不能为空"
            })
            return
        }
        if (props.riskSet.initFund === "") {
            Toast.show({
                icon: "fail",
                content: "请填写初始资金"
            })
            return
        }

        let userInfo = JSON.parse(localStorage.userInfo);
        let userId = userInfo.id

        let comboStyle = JSON.stringify(props.riskSet.styles)

        let params = {
            comboId: props.comboId ? props.comboId : 0,
            comboName: props.riskSet.composeName,
            initFund: Number(props.riskSet.initFund) * 10000,
            payPrice: 0,
            description: props.riskSet.discribe,
            comboStyle: comboStyle,
            isEnable: props.riskSet.isOnRisk,
            stopProfitRatio: Number(props.riskSet.stopProfitRatio),
            stopLossRatio: Number(props.riskSet.stopLossRatio),
            moveStopProfitRatio: Number(props.riskSet.moveStopProfitRatio),
            isNew: props.comboId ? 0 : 1,//isNew 1表示新创建 0表示编辑
            commission: costValue.value,//  commission手续费率
            startTime: moment(startDateValue, 'YYYY-MM-DD').format('YYYYMMDD'),
            endTime: moment(endDateValue, 'YYYY-MM-DD').format('YYYYMMDD'),
            userId
        }

        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        testStrategy(params).then(res => {
            Toast.clear()
            if(!res){
                Toast.show({
                    icon:"fail",
                    content:"服务端出错，回测没有数据"
                })
            }

        }).catch(err => {
            Toast.clear()
        })


    }

    const onDeploy = () => {
        Dialog.confirm({
            title: "提示",
            content: (
                <>
                    <p>组合托管后，每收到一次组合的调仓信息，系统化会从您的积分账户扣除10积分。</p>
                </>
            ),
            onConfirm: () => {
                if (props.riskSet.composeName.trim() === "") {
                    Toast.show({
                        icon: "fail",
                        content: "组合名称不能为空"
                    })
                    return
                }
                if (props.riskSet.styles.length === 0) {
                    Toast.show({
                        icon: "fail",
                        content: "组合风格不能为空"
                    })
                    return
                }
                if (props.riskSet.initFund === "") {
                    Toast.show({
                        icon: "fail",
                        content: "请填写初始资金"
                    })
                    return
                }

                let userInfo = JSON.parse(localStorage.userInfo);
                let userId = userInfo.id

                let comboStyle = JSON.stringify(props.riskSet.styles)

                let params = {
                    comboName: props.riskSet.composeName,
                    initFund: Number(props.riskSet.initFund) * 10000,
                    payPrice: 0,
                    description: props.riskSet.discribe,
                    comboStyle: comboStyle,
                    isEnable: props.riskSet.isOnRisk,
                    stopProfitRatio: Number(props.riskSet.stopProfitRatio),
                    stopLossRatio: Number(props.riskSet.stopLossRatio),
                    moveStopProfitRatio: Number(props.riskSet.moveStopProfitRatio),
                    userId,
                    comboType: 0,
                }
                if (props.riskSet.isOnRisk === 0) {
                    delete params.stopProfitRatio
                    delete params.stopLossRatio
                    delete params.moveStopProfitRatio
                }


                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })

                risksettingNext(params).then(res => {
                    Toast.clear()
                    if (res === 'fourth_step_risksetting finish') {
                        Toast.show({
                            icon: "success",
                            content: "创建成功",
                            afterClose: () => {
                                navigate('/compose/0', { replace: true })
                            }
                        })

                    } else {
                        Toast.show({
                            icon: "fail",
                            content: "创建失败",
                        })

                    }
                }).catch(err => {
                    Toast.clear()
                    Toast.show({
                        icon: "fail",
                        content: "创建失败",
                    })
                })


            }
        })
    }

    const onUpdate = () => {

        let userInfo = JSON.parse(localStorage.userInfo);
        let userId = userInfo.id
        const { isOnRisk, moveStopProfitRatio, stopProfitRatio, stopLossRatio, composeName, styles, discribe, initFund } = props.composeData.riskSet
        const { firstConditionValue, secondConditionValue, strategy, maxStockNum, singlStockBuyRatio, singlStockMaxPositionRatio, singlCountBuyRatio, singlCountSellRatio,
            period, timeValue,
        } = props.composeData.tradeSet
        const { isEnable, actionOneValue, actioTwoValue, selectedList } = props.composeData.selectTime
        let indicators = selectedList.map(item => {
            let parameter = '', value = item.inputArr.join('~');
            if (item.sp) {
                parameter = JSON.parse(item.sp).map(item => item.value).join(',')
            }

            if (item.region && JSON.parse(item.region).length === 1 && JSON.parse(item.region)[0].value === '~') {
                //disbable的值
                value = ''
            }

            if (item.compareSign === '=') {
                value = item.defalutValue
            }

            let result = {
                tId: item.tId,
                pId: item.pId,
                value: value,
                sp: parameter,
                operator: '~',
                type: 1
            }
            if (item.regionIndex > -1) {
                result.selectOptions = JSON.parse(item.region)[item.regionIndex].value
            }

            return result
        })

        const data = {
            comboId: props.composeId,
            riskSetting: { isEnable: isOnRisk, moveStopProfitRatio: moveStopProfitRatio, stopLossRatio: stopLossRatio, stopProfitRatio: stopProfitRatio },
            selectStockComboxInfo: { comboName: composeName, comboType: 0, comboStyle: JSON.stringify(styles), description: discribe, initFund: initFund * 10000 },
            selectStockParameter: selectStockParameter(userId),
            selectTimeSetting: { userId, isEnable: isEnable, closePostionRatio: actioTwoValue.value, count: actionOneValue.value, indicators:JSON.stringify(indicators), param: null, selectDate: null },
            strategySetting: {
                execFrequency: period, execTime: timeValue, parameter: strategy.params, strategyId: strategy.confirmId,
                strategyName: strategy.strategyName
            },
            tradeSetting: {
                maxStockNum: maxStockNum, onePriorityCondition: firstConditionValue.id, twoPriorityCondition: secondConditionValue.id,
                singlCountBuyRatio, singlCountSellRatio, singlStockBuyRatio, singlStockMaxPositionRatio,
            },
            userId: userId,
        }
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        updateCombination(data).then(res => {
            Toast.clear()
            if (res === 'edit_comboInfo_submit finish') {
                navigate('/compose/0')
                Toast.show({
                    icon: "success",
                    content: "保存成功"
                })
            } else {
                Toast.show({
                    icon: "fail",
                    content: "更新失败"
                })
            }
        }).catch(err => {
            Toast.clear()
            Toast.show({
                icon: "fail",
                content: "更新失败"
            })
        })
    }

    const selectStockParameter = (userId) =>{
        const { marketArr, indicateArr, selectedStrategy ,poolSelectCode} = props.pickstockData

        let dataFilter = marketArr.map(item => {
            return {
                tId: item.tId,
                pId: item.pId,
                value: item.tId === 7 ? 1 : item.value,
                isPercent: 0,
            }
        })

        if (indicateArr.length === 0 && !selectedStrategy.express) {
            Dialog.confirm({
                content: '请选择选股条件',
            })
            return
        }
        let arr = indicateArr.map(item => {
            let parameter = '', value = item.inputArr.join('~');
            if (item.sp) {
                parameter = JSON.parse(item.sp).map(item => item.value).join(',')
            }

            if (item.region && JSON.parse(item.region).length === 1 && JSON.parse(item.region)[0].value === '~') {
                //disbable的值
                value = ''
            }

            if (item.compareSign === '=') {
                value = item.defalutValue
            }

            let result = {
                tId: item.tId,
                pId: item.pId,
                value: value,
                sp: parameter,
                operator: '~',
                type: 1
            }

            if (item.regionIndex>-1) {
                result.selectOptions = JSON.parse(item.region)[item.regionIndex].value
            }

            return result
        })

        dataFilter = [...dataFilter, ...arr]
        return  {
            mySelectstock: poolSelectCode.map(item => item.symbol + " " + item.name).toString(),
            selectCondition: JSON.stringify(dataFilter),
            userId: userId,
            express: selectedStrategy && selectedStrategy.express ? selectedStrategy.express : "",
            selectType: 1
        }
    }



    return (
        <div className='risk-control-wrapper'>
            <div className="main-title">4.风险设置</div>
            <div className="content">
                <Radio.Group onChange={(e) => {
                    props.changeRiskSetValue({ type: 'isOnRisk', value: e })
                }} value={props.riskSet.isOnRisk}>
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <Radio value={0} style={{ '--font-size': '14px' }}>不风控</Radio>
                        <Radio value={1} style={{ '--font-size': '14px' }}>开启风控</Radio>
                    </div>
                </Radio.Group>
            </div>

            {props.riskSet.isOnRisk === 1 ?
                <div className="content">
                    <div className="risk-item">
                        <div className="risk-item-name">止盈比例：</div>
                        <input type="number" className="risk-input" value={props.riskSet.stopProfitRatio}
                            onChange={(e) => props.changeRiskSetValue({ type: "stopProfitRatio", value: e.target.value })} /><span>%</span>
                    </div>
                    <div className="risk-item">
                        <div className="risk-item-name">止损比例：</div>
                        <input type="number" className="risk-input" value={props.riskSet.stopLossRatio}
                            onChange={(e) => props.changeRiskSetValue({ type: "stopLossRatio", value: e.target.value })} /><span>%</span>
                    </div>
                    <div className="risk-item">
                        <div className="risk-item-name">移动止盈比例：</div>
                        <input type="number" className="risk-input" value={props.riskSet.moveStopProfitRatio}
                            onChange={(e) => props.changeRiskSetValue({ type: "moveStopProfitRatio", value: e.target.value })} /><span>%</span>
                    </div>
                </div> : null
            }

            <div className="content">
                <div className="risk-item">
                    <div>组合名称：</div>
                    <input type="text" className="risk-input" value={props.riskSet.composeName} onChange={(e) => props.changeRiskSetValue({ type: "composeName", value: e.target.value })} />
                </div>
                <div className="risk-style-item">
                    <div style={{ marginBottom: 5 }}>组合风格：</div>
                    <Checkbox.Group
                        value={props.riskSet.styles}
                        onChange={val => {
                            props.changeRiskSetValue({ type: "styles", value: val })

                        }}
                    >
                        <Checkbox value='大盘' style={{ '--font-size': '14px', '--icon-size': '19px' }}>大盘</Checkbox>
                        <Checkbox value='小盘' style={{ '--font-size': '14px', '--icon-size': '19px' }}>小盘</Checkbox>
                        <Checkbox value='次新' style={{ '--font-size': '14px', '--icon-size': '19px' }}>次新</Checkbox>
                        <Checkbox value='价值' style={{ '--font-size': '14px', '--icon-size': '19px' }}>价值</Checkbox>
                        <Checkbox value='成长' style={{ '--font-size': '14px', '--icon-size': '19px' }}>成长</Checkbox>
                        <Checkbox value='择时' style={{ '--font-size': '14px', '--icon-size': '19px' }}>择时</Checkbox>
                        <Checkbox value='趋势' style={{ '--font-size': '14px', '--icon-size': '19px' }}>趋势</Checkbox>
                    </Checkbox.Group>
                </div>
                <div className="risk-item">
                    <div>初始资金：</div>
                    <input type="number" className="risk-input" value={props.riskSet.initFund}
                        onChange={(e) => props.changeRiskSetValue({ type: "initFund", value: e.target.value })} /><span>万</span>
                </div>

                <div className="risk-style-item">
                    <div style={{ marginBottom: 5 }}>策略说明：</div>
                    <textarea
                        className="input-discribe"
                        placeholder='请输入内容'
                        value={props.riskSet.discribe}
                        onChange={e => {
                            props.changeRiskSetValue({ type: "discribe", value: e.target.value })
                        }}
                    />
                </div>
            </div>

            <div className="footer-btn">
                <div onClick={() => {
                    navigate(-1)
                }}>上一步</div>
                {props.composeId ? <div onClick={onUpdate}>更新</div> : <div onClick={onDeploy}>托管</div>}

            </div>

            <div style={{ marginTop: 30, fontSize: 15, }}>策略回测</div>
            <div className="content">

                <div className="select-backtest-date">
                    <div>回测时间：</div>
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
                        value={moment(startDateValue, 'YYYY-MM-DD').subtract(1, 'months').toDate()}
                        precision='day'
                        onConfirm={val => {
                            setStartDateValue(moment(val).format('YYYY-MM-DD'))



                        }}
                    />
                    <span style={{ "margin": '0px 5px' }}>~</span>
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
                        value={moment(endDateValue, 'YYYY-MM-DD').toDate()}
                        precision='day'
                        onConfirm={val => {
                            setEndDateValue(moment(val).format('YYYY-MM-DD'))
                        }}
                    />

                </div>
                <div className="set-item">
                    <div>收益基准：</div>
                    <div className="set-item-right">
                        <span>沪深300指数</span>
                        <img src={arrow_icon} alt="" />
                    </div>
                </div>
                <div className="set-item" onClick={() => setVisibleAction(true)}>
                    <div>交易成本（单边）：</div>
                    <div className="set-item-right">
                        <span>{costValue.text}</span>
                        <img src={arrow_icon} alt="" />
                    </div>
                </div>
                <ActionSheet
                    extra='交易成本（单边）'
                    cancelText='取消'
                    visible={visibleAction}
                    actions={costActions}
                    onClose={() => setVisibleAction(false)}
                />

            </div>
            <div className="backtest-btn" onClick={onBacktest}>开始回测</div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        comboId:state.compose.composeId,
        riskSet: state.compose.riskSet,
        composeId: state.compose.composeId,
        composeData: state.compose,
        pickstockData: state.pickStock
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeRiskSetValue: (data) => {
            dispatch(changeRiskSetValue(data))
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(RiskControl)
