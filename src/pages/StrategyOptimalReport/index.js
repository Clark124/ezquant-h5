import { useRef, useEffect } from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KChart, splitData, klineTestData } from '../../components/stockchart-react-h5'
import * as echarts from 'echarts';
import './index.scss'
import moment from 'moment';
import { onGetNewKline, onGetQuote, setStrategyIndex, updateTrustData } from '../Trade/actions'

import { startegyDetail } from '../../service/traderoom'
import { defaultProps } from 'antd-mobile-v5/es/components/pull-to-refresh/pull-to-refresh'
import { Toast } from 'antd-mobile-v5'

let lineOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 5,
        icon: "circle",
        data: ['收益率',]
    },
    color: ['#266ED0',],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '40',
        containLabel: true
    },
    //x轴
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {},
    series: [
        {
            name: '收益率',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
        }
    ]
}

function BacktestReport(props) {
    const params = useParams()
    const navigate = useNavigate()

    const [startDateStr, setstartDateStr] = useState("")
    const [endDateStr, setendDateStr] = useState("")
    const [period, setPeriod] = useState("")
    const [backtestParameter, setbacktestParameter] = useState({})
    const [lineData, setlineData] = useState([])
    const [orders, setOrders] = useState([])
    const [perform, setPerform] = useState({})
    const [tradeInfoPair, setTradeInfoPair] = useState([])
    const [strategys, setStrategys] = useState([])


    const lineRef = useRef(null)
    const kchartRef = useRef(null)

    useEffect(() => {
        getInit()
        // getStrategyList()
    }, [])

    const getInit = () => {
        let id = params.id
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        startegyDetail({releaseId:id}).then(res => {
            Toast.clear()
            const { netValue, orders, perform, backtestParameter, tradeInfoPair } = res.data
            setstartDateStr(backtestParameter.startDateStr)
            setendDateStr(backtestParameter.endDateStr)
            let period
            if (backtestParameter.period) {
                if (backtestParameter.period === 1) {
                    period = '分时'
                } else if (backtestParameter.period === 2) {
                    period = '5分钟'
                } else if (backtestParameter.period === 3) {
                    period = '15分钟'
                } else if (backtestParameter.period === 4) {
                    period = '30分钟'
                } else if (backtestParameter.period === 5) {
                    period = '60分钟'
                } else if (backtestParameter.period === 6) {
                    period = '日K'
                }
            }
            setPeriod(period)
            setPerform(perform)
            setOrders(tradeInfoPair)
            setbacktestParameter(backtestParameter)
            props.onGetNewKline(backtestParameter.prodCode, backtestParameter.period, (stockDate) => {
                initKline(stockDate, props.period, orders)
            })
            let dateList = []
            let valueList = []
            let lineList = []
            Object.entries(netValue).forEach(value => {
                lineList.push({
                    date: Number(value[0]),
                    value: parseFloat(value[1].toFixed(2)),
                })

            })

            lineList.sort((a, b) => {
                return a.date - b.date
            })

            lineList.forEach(item => {
                dateList.push(moment(item.date).format(backtestParameter.period < 6 ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'))
                valueList.push(item.value)
            })

            lineOption.xAxis.data = dateList
            lineOption.series[0].data = valueList

            const yieldChart = echarts.init(lineRef.current)
            yieldChart.setOption(lineOption)





        })

    }

    const renderYield = () => {

    }

    const initKline = (data, period, orders) => {

        let values = splitData(data)
        let alert = orders.map(item => {
            return {
                time: moment(item.date, 'YYYY-MM-DD').format('YYYYMMDD'),
                type: item.buysell === 1 ? 1 : 3
            }
        })
        const option = {
            alerts: alert
        }

        kchartRef.current.init(values, option)
    }

    //策略列表
    const getStrategyList = () => {
        // const data = {
        //     name: "",
        //     pageNum: 1,
        //     pageSize: 200,
        //     strategyType: props.marketType === 0 ? '0' : '1'
        // }

        // strategyList(data).then(res => {
        //     if (res.data && res.data.list.length > 0) {
        //         let list = res.data.list.filter(item => item.express)
        //         setStrategys(list)
        //     }
        // })
    }

    //跳转到托管页面
    const navTrusteeship = () => {
       
        props.updateTrustData({ type: "trustName", value: "" })
        let parameter = backtestParameter
        parameter.symbol = backtestParameter.prodCode
        parameter.hostingName = backtestParameter.strategyName
        localStorage.setItem('followParams', JSON.stringify(parameter))
        navigate('/strategyRealReport/follow/' + params.releaseId)
    }

    return (
        <div className="strategy-detail-wrapper">
            {/* 策略回测参数 */}
            <div className="params-list">
                <div className="title">策略回测参数</div>
                <div className="params">
                    <div className="params-item">
                        <div className="params-data">策略名称</div>
                        <div className="params-title">{backtestParameter.strategyName}</div>
                    </div>
                    <div className="params-item">
                        <div className="params-data">股票名称</div>
                        <div className="params-title">{backtestParameter.prodName}</div>
                    </div>
                    <div className="params-item">
                        <div className="params-data">K线频率</div>
                        <div className="params-title">{period}</div>
                    </div>

                </div>
                <div className="params">
                    <div className="params-item">
                        <div className="params-data">开始时间</div>
                        <div className="params-title">{backtestParameter.startDateStr}</div>
                    </div>
                    <div className="params-item">
                        <div className="params-data">结束时间</div>
                        <div className="params-title">{backtestParameter.endDateStr}</div>
                    </div>

                    <div className="params-item">
                        <div className="params-data">初始资金</div>
                        <div className="params-title">{backtestParameter.initCapital}</div>
                    </div>
                </div>
            </div>
            {/* 基本统计 */}
            <div className="main-info">
                <div className="title">
                    基本统计
                </div>
                <div className="info-list">
                    <div className="list-head">
                        <span>收益率</span>
                        <span>最大回撤</span>
                        <span>盈利次数</span>
                    </div>
                    <div className="list-date">
                        <span>{perform.return_ratio}%</span>
                        <span>{perform.MaxDD}%</span>
                        <span >{perform.nwinner}</span>
                    </div>
                </div>
                <div className="info-list">
                    <div className="list-head">
                        <span>平均盈利</span>
                        <span>连胜次数</span>
                        <span>择时收益率</span>
                    </div>
                    <div className="list-date">
                        <span>{perform.winner_avg}</span>
                        <span>{perform.max_nwinner}</span>
                        <span >{perform.timing_return}%</span>
                    </div>
                </div>
                <div className="info-list">
                    <div className="list-head">
                        <span>收益风险比</span>
                        <span>亏损次数</span>
                        <span>平均亏损</span>
                    </div>
                    <div className="list-date">
                        <span>{perform.return_risk_ratio}</span>
                        <span>{perform.nloser}</span>
                        <span >{perform.loser_avg}</span>
                    </div>
                </div>
                <div className="info-list">
                    <div className="list-head">
                        <span>连亏次数</span>
                        <span>年化收益率</span>
                        <span>盈利因子</span>
                    </div>
                    <div className="list-date">
                        <span>{perform.max_nloser}</span>
                        <span>{perform.yearly_return_ratio}%</span>
                        <span >{perform.profit_factor}</span>
                    </div>
                </div>
                <div className="info-list">
                    <div className="list-head">
                        <span>胜率</span>
                        <span>最大资产规模</span>
                        <span>最小资产规模</span>
                    </div>
                    <div className="list-date">
                        <span>{perform.winning_ratio}%</span>
                        <span>{perform.largest_capital}</span>
                        <span >{perform.minimum_capital}</span>
                    </div>
                </div>
            </div>
            {/* 收益图 */}
            <div className="profit-chart-wrapper">
                <div className="profit-chart-title">
                    <span>净值曲线图</span>
                </div>
                <div className="chart-list">
                    <div className="line-chart" ref={lineRef}></div>
                </div>
            </div>
            {/* 买卖信号 */}
            <div className="signal-wrapper">
                <div className="title">买卖信号</div>
                <KChart ref={kchartRef} />
            </div>

            {/* 交易记录 */}
            <div className="hold-position">
                <div className="title">
                    交易记录
                </div>
                {orders.map((item, index) => {
                    return (
                        <div className="hold-data-list" key={index}>

                            <div className='price'>
                                <span>股票：{backtestParameter.prodName}</span>
                                <span>盈亏：<span className={item.pl >= 0 ? "update-down red" : "update-down green"}>{item.pl}</span></span>
                            </div>
                            <div className='price'>
                                <span>数量：{item.amount}</span>
                                <span>交易类型： <span className={item.buysell === '买' ? "update-down red" : "update-down green"}>{item.buysell}</span></span>
                            </div>
                            <div className='price'>
                                <span>开仓时间：{item.openTime}</span>
                                <span>开仓价格：{item.openPrice}</span>
                            </div>
                            <div className='price'>
                                <span>平仓时间：{item.closeTime}</span>
                                <span>平仓价格：{item.closePrice}</span>
                            </div>



                        </div>
                    )
                })}

            </div>

     

            <div className="tips">
                风险提示：投资有风险，组合信号不对您构成任何投资建议，据此操作，风险自担。
            </div>

            <div className="footer">
                <div className="follow-btn" onClick={navTrusteeship}>跟单</div>
                {/* <div className="follow-btn">跟单<br></br>300元/月</div> */}
                {/* <div className="collect-btn">收藏</div> */}
            </div>


        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        stockCode: state.traderoom.code,
        quote: state.traderoom.quote,
        marketType: state.traderoom.marketType,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

        onGetNewKline: (code, period, callback) => {
            dispatch(onGetNewKline(code, period, callback))
        },
        onGetQuote: (code, uuid) => {
            dispatch(onGetQuote(code, uuid))
        },
        setStrategyIndex: (data) => {
            dispatch(setStrategyIndex(data))
        },
        updateTrustData: (data) => {
            dispatch(updateTrustData(data))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BacktestReport)