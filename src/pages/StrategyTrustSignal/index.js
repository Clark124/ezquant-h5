
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { runStrategyLog } from '../../service/strategy'

import './index.scss'

export default function StrategyTrustSignal() {
    const params = useParams()
    const [logList, setLogList] = useState([])


    useEffect(() => {
        getRunStrategyLog(params.id)
    }, [])

    const getRunStrategyLog = (id) => {
        runStrategyLog({ strategyId: id }).then(res => {
            let signalLog = res.data.map((item, index) => {
                let sell, open
                if (item.buysell === 1) {
                    sell = '买'

                } else {
                    sell = '卖'
                }
                if (item.openclose === 1) {
                    open = '开'
                } else {
                    open = '平'
                }
                return {
                    time: item.time,
                    sell,
                    open,
                    count: item.lots,
                    price: item.price,
                    key: item.createDate + index
                }
            })
            setLogList(signalLog)
            // let lastSignLogTime = ""
            // if (signalLog.length > 0) {
            //     lastSignLogTime = signalLog[0].time
            // }
            // console.log(lastSignLogTime)
            // this.setState({ signalLog })
            // if (lastSignLogTime) {
            //     this.setState({ lastSignLogTime })
            // }
        })
    }
    return (
        <div className="strategy-trust-signal-wrapper">
            <div className="content">
                <div className="strategy-trust-signal-head">
                    <span>时间</span>
                    <span>开平</span>
                    <span>买卖</span>
                    <span>数量</span>
                    <span>价格</span>
                </div>
                {logList.map((item, index) => {
                    return (
                        <div className="strategy-trust-signal-item">
                            <span className="time">{item.time}</span>
                            <span>{item.open}</span>
                            <span>{item.sell}</span>
                            <span>{item.count}</span>
                            <span className="red">{item.price}</span>
                        </div>
                    )
                })}
                {logList.length === 0 ?
                    <div className='no-data'>
                        暂无信号
                    </div> : null
                }
            </div>
        </div>
    )
}