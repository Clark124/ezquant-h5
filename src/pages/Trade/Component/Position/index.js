import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { queryPosition } from '../../../../service/traderoom'
import './index.scss'
import { Dialog, Modal, Toast, Radio } from 'antd-mobile-v5'
import { closeStrategyAllPosition } from '../../../../service/traderoom'

function Position(props) {
    let [positionList, setPositionList] = useState([])
    const [tabIndex, setTabIndex] = useState(0)

    useEffect(() => {
        onQueryPosition(props.account)
    }, [])

    const onQueryPosition = (account) => {
        const data = {
            'ctp.userId': account.AccountID,
            'ctp.brokerId': account.BrokerID
        }
        queryPosition(data).then(res => {
            let positionList = Object.values(res).filter(item => {
                return item.instrument && ((item.preVolume + item.todayVolume) !== 0)
            }).map(item => {
                return {
                    InstrumentID: item.instrument,
                    Direction: item.b_S === 'B' ? '0' : '1',
                    averageOpenPrice: (item.preAvgPrice * item.preVolume + item.todayVolume * item.todayAvgPrice) / (item.preVolume + item.todayVolume),
                    volume: item.preVolume + item.todayVolume,
                    profit: item.accumulatePositionPL.toFixed(1),
                    contractName: item.contractName,
                    enableVolume: item.preVolume
                }
            })
            setPositionList(positionList)
        })

    }

    const closeAllPosition = (direction, enableVolume, instrumentId, enable, code) => {
        Dialog.confirm({
            content: '此次操作将平掉当前选中的所有仓位,谨慎下单',
            onConfirm: () => {
                if (enableVolume <= 0 && props.marketType === 0) {
                    Dialog.confirm({
                        content: "昨仓量为0，今日无法平仓！"
                    })
                    return
                }

                const account = props.account
                const userId = account.AccountID
                const brokerId = account.BrokerID
                const data = {
                    bs: direction === 1 ? 'B' : 'S',
                    'ctp.brokerId': brokerId,
                    'ctp.userId': userId,
                    // 'ctp.releaseId':item.releaseId,
                    instrumentId: instrumentId
                }
                closeStrategyAllPosition(data).then(res => {
                    if (res.response_status === "0") {
                        onQueryPosition(props.account)
                    }
                    if (res.fail) {
                        Toast.show({
                            icon: "fail",
                            content: res.fail
                        })
                    }
                })
            }
        })
    }

    if (tabIndex === 0) {
        positionList = positionList.filter(item => {
            return item.InstrumentID === props.code
        })
    }

    return (
        <div className="position-wrapper">
            <div className="current-all">
                <Radio.Group value={tabIndex} onChange={(e) => {
                    setTabIndex(e)

                }}>
                    <Radio value={0} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '10px' }}>{props.quote.prod_name}</Radio>
                    <Radio value={1} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '10px' }}>全部股票</Radio>
                </Radio.Group>
            </div>
            {positionList.map((item, index) => {
                return (
                    <div className="position-item" key={index}>
                        <div className="code-date">
                            <span className="code-name">{item.contractName} {item.InstrumentID}</span>
                            <span className="cancel-order-btn" onClick={() => closeAllPosition(item.Direction === '0' ? 1 : 0, item.enableVolume, item.InstrumentID, item.enable_amount, item.code)}>平仓</span>
                        </div>
                        <div className="info-line">
                            <div>
                                <span>买入均价：</span>
                                <span>{item.averageOpenPrice.toFixed(2)}</span>
                            </div>
                            <div>
                                <span>股数：</span>
                                <span>{item.volume}</span>
                            </div>
                        </div>

                        <div className="info-line">
                            {/* <div>
                            <span>浮动盈亏</span>
                            <span className="red">{item.profit}</span>
                        </div> */}
                            <div>
                                <span>盈亏：</span>
                                <span className={item.profit >= 0 ? "red" : "green"}>{item.profit}</span>
                            </div>
                        </div>

                        {/* <div className="info-line">
                        <div>
                            <span>最新市值</span>
                            <span >14168.01</span>
                        </div>
                        <div>
                            <span>仓位</span>
                            <span >30.24%</span>
                        </div>
                    </div> */}
                    </div>
                )
            })}
            {positionList.length === 0 ?
                <div className="no-data">暂无持仓</div> : null
            }

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        code:state.traderoom.code,
        quote: state.traderoom.quote,
        account: state.traderoom.account,
        marketType: state.traderoom.marketType,
    };
}
export default connect(mapStateToProps, null)(Position)
