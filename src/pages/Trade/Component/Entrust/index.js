import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './index.scss'
import { historyLog, runStrategy, histroyEntrustList, declarationReturn, dealReturn } from '../../../../service/traderoom'
import { Radio, Picker } from 'antd-mobile-v5'

import arrow_icon from '../../../../asstes/images/grarrow.png'


function Entrust(props) {
    const [dataList, setDataList] = useState([])
    const [trustIndex, setEntrustIndex] = useState(0)
    const [periodIndex, setPeriodIndex] = useState(5)
    const [tabIndex, setTabIndex] = useState(0)
    const [deployList, setDeployList] = useState([[{ id: 0, label: '全部', value: 0 ,key: 0}, { id: 1, label: '手动', value: 1,key: 1 }]])
    const [deployIndex, setDeployIndex] = useState([0])
    const [visiblePicker, setVisiblePicker] = useState(false)


    useEffect(() => {
        getData(props.account, props.code, tabIndex, periodIndex, trustIndex)
        onMandatoryList()
    }, [])
    useEffect(() => {
        getData(props.account, props.code, tabIndex, periodIndex, trustIndex)
    }, [deployIndex])


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



    const getData = (account, code, tabIndex, periodIndex, trustIndex) => {

        let instrumentId = ""
        let releaseId
        if (deployIndex[0] === 0) {
            releaseId = ""
        } else if (deployIndex[0] === 1) {
            releaseId = 'HAND'
        } else {
            releaseId = deployList[0][deployIndex[0]].id
        }
        if (tabIndex === 0) {
            instrumentId = code
        }
        const data = {
            'ctp.userId': account.AccountID,
            'ctp.brokerId': account.BrokerID,
            'ctp.limitNumber': 6,
            'ctp.instrumentId': instrumentId,
            'sectionFlag': periodIndex - 1,
            releaseId
        }
        if (tabIndex === 1) {
            delete data['ctp.instrumentId']
        }
        if (deployIndex[0] === 0) {
            delete data['releaseId']
        }
        if (periodIndex !== 5) {
            data['ctp.limitNumber'] = 100000
        }

        let fun = null

        if (trustIndex === 0) {
            fun = historyLog
        } else if (trustIndex === 1) {
            fun = histroyEntrustList
        } else if (trustIndex === 2) {
            fun = declarationReturn
        } else if (trustIndex === 3) {
            fun = dealReturn
        }


        fun(data).then(res => {
            if (res.data) {
                let dataList = res.data

                setDataList(dataList)
            }
        })
    }

    const tabEntrustIndex = (entrustIndex) => {
        setEntrustIndex(entrustIndex)
        getData(props.account, props.code, tabIndex, periodIndex, entrustIndex)

    }

    return (
        <div className="entrust-wrapper">
            <div className="tab">
                <span className={trustIndex === 0 ? "active" : ""} onClick={() => tabEntrustIndex(0)}>日志</span>
                <span className={trustIndex === 1 ? "active" : ""} onClick={() => tabEntrustIndex(1)}>报单回执</span>
                <span className={trustIndex === 2 ? "active" : ""} onClick={() => tabEntrustIndex(2)}>报单回报</span>
                <span className={trustIndex === 3 ? "active" : ""} onClick={() => tabEntrustIndex(3)}>成交回报</span>
            </div>

            <div style={{ background: '#fff', padding: 10, marginBottom: 10 }}>
                <div className="current-all">
                    <Radio.Group value={tabIndex} onChange={(e) => {
                        setTabIndex(e)
                        getData(props.account, props.code, e, periodIndex, trustIndex)

                    }}>
                        <Radio value={0} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '10px' }}>{props.quote.prod_name}</Radio>
                        <Radio value={1} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '10px' }}>全部股票</Radio>
                    </Radio.Group>
                </div>

                <div className="period-list">
                    <Radio.Group value={periodIndex} onChange={(e) => {
                        setPeriodIndex(e)
                        getData(props.account, props.code, tabIndex, e, trustIndex)

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
                        // getData(props.account, props.code, tabIndex, periodIndex, trustIndex)
                    }}
                />
            </div>
            {trustIndex === 0 ?
                <div className="entrust-list">
                    {dataList.map((item, index) => {
                        return (
                            <div className="entrust-item" key={index}>
                                <div className="code-date">
                                    <span className="code-name">{item.contractName} {item.symbol}</span>

                                </div>
                                <div className="entrust-info">
                                    <span>时间</span>
                                    <span >{item.time}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>来源</span>
                                    <span >{item.source}</span>
                                </div>
                                <div className="entrust-info-detail">
                                    <div className="entrust-info-detail-text">详细信息</div>
                                    <div dangerouslySetInnerHTML={{ __html: item.showMsg }}></div>
                                </div>
                            </div>
                        )
                    })}
                </div> : null
            }

            {trustIndex === 1 ?
                <div className="entrust-list">
                    {dataList.map((item, index) => {
                        return (
                            <div className="entrust-item" key={index}>
                                <div className="code-date">
                                    <span className="code-name">{item.contractName} {item.symbol}</span>

                                </div>
                                <div className="entrust-info">
                                    <span>买卖</span>
                                    <span className={item.buysell === '买入' ? "red" : "green"}>{item.buysell}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>报单价</span>
                                    <span >{item.limitPrice}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>报单时间</span>
                                    <span >{item.gtdDate}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>报单回执</span>
                                    <span >{item.errorMsg}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>开平</span>
                                    <span >{item.openclose}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>交易数量</span>
                                    <span >{item.volumeTotalOriginal}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>来源</span>
                                    <span >{item.source}</span>
                                </div>
                            </div>
                        )
                    })}

                </div> : null
            }

            {trustIndex === 2 ?
                <div className="entrust-list">
                    {dataList.map((item, index) => {
                        return (
                            <div className="entrust-item" key={index}>
                                <div className="code-date">
                                    <span className="code-name">{item.contractName} {item.symbol}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>买卖</span>
                                    <span className={item.buysell === '买入' ? "red" : "green"}>{item.buysell}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>交易数量</span>
                                    <span >{item.volumeTotalOriginal}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>报单价</span>
                                    <span >{item.limitPrice}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>挂单状态</span>
                                    <span >{item.orderStatus}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>开平</span>
                                    <span >{item.openclose}</span>
                                </div>

                                <div className="entrust-info">
                                    <span>报单时间</span>
                                    <span >{item.insertDatetime}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>来源</span>
                                    <span >{item.source}</span>
                                </div>
                            </div>
                        )
                    })}

                </div> : null
            }

            {trustIndex === 3 ?
                <div className="entrust-list">
                    {dataList.map((item, index) => {
                        return (
                            <div className="entrust-item" key={index}>
                                <div className="code-date">
                                    <span className="code-name">{item.contractName} {item.symbol}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>买卖</span>
                                    <span className={item.buysell === '买入' ? "red" : "green"}>{item.buysell}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>交易数量</span>
                                    <span >{item.volume}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>成交时间</span>
                                    <span >{item.insertDatetime}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>开平</span>
                                    <span >{item.openclose}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>成交价</span>
                                    <span >{item.price}</span>
                                </div>
                                <div className="entrust-info">
                                    <span>来源</span>
                                    <span >{item.source}</span>
                                </div>
                            </div>
                        )
                    })}

                </div> : null
            }

            {dataList.length === 0 ?
                <div className="no-data">暂无数据</div> : null
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
export default connect(mapStateToProps, null)(Entrust)