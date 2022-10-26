import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { List } from 'antd-mobile'
import './index.scss'
import moment from 'moment'
import { Radio, Picker } from 'antd-mobile-v5'

import { historyTrade, historyTradeRecent, runStrategy } from '../../../../service/traderoom'

import arrow_icon from '../../../../asstes/images/grarrow.png'

function History(props) {
    const [dataList, setDataList] = useState([])
    const [periodIndex, setPeriodIndex] = useState(5)
    const [tabIndex, setTabIndex] = useState(0)
    const [deployList, setDeployList] = useState([[{ id: 0, label: '全部', value: 0, key: 0 }, { id: 1, label: '手动', value: 1, key: 1 }]])
    const [deployIndex, setDeployIndex] = useState([0])
    const [visiblePicker, setVisiblePicker] = useState(false)

    useEffect(() => {
        getHistoryTrade(props.account, props.code, tabIndex, periodIndex)
        onMandatoryList()
    }, [])

    const getHistoryTrade = (account, code, tabIndex, periodIndex) => {

        if (periodIndex < 5) {
            let releaseId
            if (deployIndex[0] === 1) {
                releaseId = 'HAND'
            } else {
                releaseId = deployList[0][deployIndex[0]].id
            }

            let instrumentId = ""
            if (tabIndex === 0) {
                instrumentId = code
            }
            const data = {
                'ctp.releaseId': releaseId,
                'ctp.userId': account.AccountID,
                'ctp.brokerId': account.BrokerID,
                'instrumentId': instrumentId,
                ...getDate(periodIndex)
            }
            if (deployIndex[0] === 0) {
                delete data['ctp.releaseId']
            }
            if (tabIndex === 1) {
                delete data['instrumentId']
            }
            historyTrade(data).then(res => {
                setDataList(res.data)
            })
        } else {
            //最近
            let releaseId
            if (deployIndex[0] === 1) {
                releaseId = account.BrokerID + account.AccountID
            } else {
                releaseId = deployList[0][deployIndex[0]].id
            }

            let instrumentId = ""
            if (tabIndex === 0) {
                instrumentId = code
            }
            const data = {
                'ctp.releaseId': releaseId,
                'ctp.userId': account.AccountID,
                'ctp.brokerId': account.BrokerID,
                'ctp.limitNumber': 6,
                instrumentId: instrumentId
            }
            if (deployIndex[0] === 0) {
                delete data['ctp.releaseId']
            }
            if (tabIndex === 1) {
                delete data['instrumentId']
            }
            historyTradeRecent(data).then(res => {
                setDataList(res.data)
            })
        }


    }

    //获取托管策略列表
    const onMandatoryList = () => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
        const data = {
            symbol: props.code,
            pageNum: 1,
            pageSize: 50,
            userId: userInfo.id
        }
        runStrategy(data).then(res => {
            let list = res.data.page_date
            list.forEach((item,index) => {
                item.key = item.id
                item.label = item.hostingName
                item.value = index+2
            })

            const value = [...deployList[0], ...list]

            setDeployList([value])
        })
    }


    //周期转换
    const getDate = (type) => {
        const data = {}
        switch (type) {
            case 1:
                data["ctp.startDate"] = moment().format("YYYYMMDD") + '000000'
                data["ctp.endDate"] = moment().format("YYYYMMDD") + '235959'
                break;
            case 2:
                data["ctp.startDate"] = moment().subtract(1, 'week').format("YYYYMMDD") + '000000'
                data["ctp.endDate"] = moment().format("YYYYMMDD") + '235959'
                break;
            case 3:
                data["ctp.startDate"] = moment().subtract(1, 'month').format("YYYYMMDD") + '000000'
                data["ctp.endDate"] = moment().format("YYYYMMDD") + '235959'
                break;
            case 4:
                data["ctp.startDate"] = moment().subtract(3, 'month').format("YYYYMMDD") + '000000'
                data["ctp.endDate"] = moment().format("YYYYMMDD") + '235959'
                break;
            case 5:

                break;

            default:
        }
        return data
    }



    return (
        <div className="history-wrapper">
            <div style={{ background: '#fff', padding: 10, marginBottom: 10 }}>
                <div className="current-all">
                    <Radio.Group value={tabIndex} onChange={(e) => {
                        setTabIndex(e)
                        getHistoryTrade(props.account, props.code, e, periodIndex)

                    }}>
                        <Radio value={0} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '10px' }}>{props.quote.prod_name}</Radio>
                        <Radio value={1} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '10px' }}>全部股票</Radio>
                    </Radio.Group>
                </div>

                <div className="period-list">
                    <Radio.Group value={periodIndex} onChange={(e) => {
                        setPeriodIndex(e)
                        getHistoryTrade(props.account, props.code, tabIndex, e)

                    }}>
                        <Radio value={5} style={{ '--font-size': '12px', '--icon-size': '18px', marginRight: '5px' }}>最近</Radio>
                        <Radio value={1} style={{ '--font-size': '12px', '--icon-size': '18px', marginRight: '5px' }}>今天</Radio>
                        <Radio value={2} style={{ '--font-size': '12px', '--icon-size': '18px', marginRight: '5px' }}>一周</Radio>
                        <Radio value={3} style={{ '--font-size': '12px', '--icon-size': '18px', marginRight: '5px' }}>一个月</Radio>
                        <Radio value={4} style={{ '--font-size': '12px', '--icon-size': '18px', marginRight: '5px' }}>三个月</Radio>
                    </Radio.Group>
                </div>
                <div className="source-wrapper" onClick={() => setVisiblePicker(true)}>
                    <div >
                        <span>来源：</span>
                        <span>{deployList[0][deployIndex[0]].label}</span>
                    </div>
                    <img src={arrow_icon} alt="" />
                </div>
                <Picker
                    columns={deployList}
                    visible={visiblePicker}
                    onClose={() => {
                        setVisiblePicker(false)
                    }}
                    value={deployIndex}
                    onConfirm={v => {
                        setDeployIndex(v)
                        setTimeout(() => {
                            getHistoryTrade(props.account, props.code, tabIndex, periodIndex)
                        }, 100)
                    }}
                />
            </div>

            {dataList.map((item, index) => {
                return (
                    <div className="history-item" key={index}>
                        <div className="code-date">
                            <span className="code-name">{item.hsName} {item.hsSymbol}</span>
                            {/* <span className="date">2015-11-19 14:12:00</span> */}
                        </div>
                        <div className="hisotry-info">
                            <span>来源</span>
                            <span >{item.tradeUnitIdOpen}</span>
                        </div>
                        <div className="hisotry-info">
                            <span>买卖</span>
                            <span style={item.buysell === 1 ? { color: 'red' } : { color: 'green' }}>{item.buysell === 1 ? '买' : '卖'}</span>
                        </div>
                        <div className="hisotry-info">
                            <span>开仓价格</span>
                            <span >{item.openPrice.toFixed(2)}</span>
                        </div>
                        <div className="hisotry-info">
                            <span>平仓价格</span>
                            <span >{item.closePrice.toFixed(2)}</span>
                        </div>
                        <div className="hisotry-info">
                            <span>开仓时间</span>
                            <span >{item.opentime}</span>
                        </div>
                        <div className="hisotry-info">
                            <span>平仓时间</span>
                            <span >{item.closetime}</span>
                        </div>
                        <div className="hisotry-info">
                            <span >盈亏</span>
                            <span style={item.pl >= 0 ? { color: 'red' } : { color: 'green' }}>{Number(item.pl).toFixed(2)}</span>
                        </div>
                        <div className="hisotry-info">
                            <span>交易数量</span>
                            <span >{item.volume}</span>
                        </div>



                    </div>
                )
            })}
            {dataList.length === 0 ?
                <div className="no-data">暂无历史记录</div> : null
            }

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        account: state.traderoom.account,
        quote: state.traderoom.quote,
        code: state.traderoom.code
    };
}
export default connect(mapStateToProps, null)(History)