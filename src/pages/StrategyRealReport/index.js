import { useRef, useEffect } from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KChart, splitData, klineTestData } from '../../components/stockchart-react-h5'
import * as echarts from 'echarts';
import './index.scss'
import moment from 'moment';
import { onGetNewKline, onGetQuote, setStrategyIndex ,updateTrustData} from '../Trade/actions'

import { queryStrategyReport, userCollect, userDeleteCollect } from '../../service/strategy'
import { strategyList } from '../../service/traderoom'
import { defaultProps } from 'antd-mobile-v5/es/components/pull-to-refresh/pull-to-refresh'
import { Toast,Dialog } from 'antd-mobile-v5'

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
    const [period, setPeriod] = useState("")
    const [periodValue,setPeriodValue] = useState(6)
    const [backtestParameter, setbacktestParameter] = useState({})
    const [lineData, setlineData] = useState([])
    const [orders, setOrders] = useState([])
    const [perform, setPerform] = useState({})
    const [tradeInfoPair, setTradeInfoPair] = useState([])
    const [strategys, setStrategys] = useState([])
    const [infoData, setInfoData] = useState({})
    const [userId, setUserId] = useState("")


    const lineRef = useRef(null)
    const kchartRef = useRef(null)

    useEffect(() => {
        let userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            userInfo = JSON.parse(userInfo)
            let userId = userInfo.id
            setUserId(userId)
        }
        getInit()
        // getStrategyList()
    }, [])

    const getInit = () => {
        let index = params.id

        queryStrategyReport({ strategyId: index }).then(res => {
            const { netValue, tradeOrders, intro, statisticsReport, strategyReport, strategySignal } = res.data



            let period
            if (strategyReport.period) {
                if (strategyReport.period === 1) {
                    period = '分时'
                } else if (strategyReport.period === 2) {
                    period = '5分钟'
                } else if (strategyReport.period === 3) {
                    period = '15分钟'
                } else if (strategyReport.period === 4) {
                    period = '30分钟'
                } else if (strategyReport.period === 5) {
                    period = '60分钟'
                } else if (strategyReport.period === 6) {
                    period = '日K'
                }
            }
            setInfoData(intro)
            setPeriod(period)
            setPeriodValue(strategyReport.period)
            setPerform(statisticsReport)
            setOrders(tradeOrders)
            setbacktestParameter(strategyReport)
            props.onGetNewKline(strategyReport.symbol, strategyReport.period, (stockDate) => {
                initKline(stockDate, strategyReport.period, strategySignal)
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
       
        let alert = []
        orders.forEach(item => {
            let obj = {}
            if (period < 6) {
                obj.time = moment(item.time, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDDHHmm')
            } else {
                obj.time = moment(item.time, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDD')
            }
            if (item.signal.buysell === 1 && item.signal.openclose === 1) {
                obj.type = 1
            } else if (item.signal.buysell === -1 && item.signal.openclose === -1) {
                obj.type = 3
            }
            alert.push(obj)

        })
        
        const option = {
            alerts: alert
        }
        kchartRef.current.init(values, option,null,period)
    }

    //策略列表
    const getStrategyList = () => {
        const data = {
            name: "",
            pageNum: 1,
            pageSize: 200,
            strategyType: props.marketType === 0 ? '0' : '1'
        }

        strategyList(data).then(res => {
            if (res.data && res.data.list.length > 0) {
                let list = res.data.list.filter(item => item.express)
                setStrategys(list)
            }
        })
    }

    //跳转到托管页面
    const navTrusteeship = () => {
        // strategys.forEach((item, index) => {
        //     if (item.name === backtestParameter.strategyName) {
        //         props.setStrategyIndex(index)
        //         console.log(index)
        //     }
        // })
        props.updateTrustData({type:"trustName",value:""})
        localStorage.setItem('followParams', JSON.stringify(backtestParameter))

        navigate('/strategyRealReport/follow/' + params.id)
    }

    //收藏
    const handleCollect = () => {
        let userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            let userId = JSON.parse(userInfo).id
            const { author } = infoData
            let id = params.id
            const data = {
                userId: userId,
                strategyId: id,
                author: author
            }
            Toast.show({
                icon: 'loading',
                content: '加载中...',
                duration: 0,
                maskClickable: false,
            })
            userCollect(data).then(res => {
                Toast.clear()
                if (res.code === 200) {
                    Toast.show({
                        icon: "success",
                        content: "收藏成功"
                    })
                    setInfoData({ ...infoData, favoriteState: 1 })
                } else {
                    Toast.show({
                        icon: "fail",
                        content: res.message
                    })
                }
            })
        } else {
            Toast.clear()
            Toast.show({
                icon: "fail",
                content: '请登录'
            })
        }

    }

    const handleCancelCollect = () => {

        let userInfo = localStorage.getItem('userInfo')
        let userId = JSON.parse(userInfo).id
        let id = params.id
        Dialog.confirm({
            title: '提示',
            content:'你确定要取消收藏吗？',
            onConfirm:()=> {
                const data = {
                    userId: userId,
                    strategyId: id
                }
                Toast.show({
                    icon: 'loading',
                    content: '加载中...',
                    duration: 0,
                    maskClickable: false,
                })
                userDeleteCollect(data).then(res => {
                    Toast.clear()
                    if (res.code === 200) {
                        Toast.show({
                            icon: "success",
                            content: "取消收藏成功"
                        })
                        setInfoData({ ...infoData, favoriteState: 0 })
                    } else {
                        Toast.show({
                            icon: "fail",
                            content: res.message
                        })
                    }
                })
            },
        });
    }


    return (
        <div className="strategy-detail-wrapper">
            {/* 基本信息 */}
            <div className="message-info">
                <div>作者：{infoData.author}</div>
                <div>上架时间：{infoData.gmtCreate}</div>
                <div>策略描述：{infoData.description ? infoData.description : "暂无介绍"}</div>
            </div>
            {/* 策略回测参数 */}
            <div className="params-list">
                <div className="title">策略运行报告</div>
                <div className="params">
                    <div className="params-item">
                        <div className="params-data">策略名称</div>
                        <div className="params-title">{backtestParameter.strategyName}</div>
                    </div>
                    <div className="params-item">
                        <div className="params-data">股票名称</div>
                        <div className="params-title">{backtestParameter.symbol}</div>
                    </div>
                    <div className="params-item">
                        <div className="params-data">K线频率</div>
                        <div className="params-title">{period}</div>
                    </div>

                </div>
                <div className="params">
                    <div className="params-item">
                        <div className="params-data">初始资金</div>
                        <div className="params-title">{backtestParameter.initCapital}</div>
                    </div>
                    <div className="params-item">
                        <div className="params-data">当前资产</div>
                        <div className="params-title">{backtestParameter.finalFund}</div>
                    </div>

                    <div className="params-item">
                        <div className="params-data">收益率</div>
                        <div className="params-title">{backtestParameter.returnRatio}%</div>
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
                <div className="hold-list">
                    {/* <div className="hold-list-head">
                        <span>数量</span>
                        <span>买卖</span>
                        <span>价格</span>
                        <span className="date">时间</span>
                        <span>盈亏</span>
                    </div> */}
                    {orders.map((item, index) => {
                        return (
                            <div className="hold-data-list" key={index}>
                                {/* <div className="code-name">
                                    <div className="stock-name">格力电器</div>
                                    <div className="stock-code">{item.code}</div>
                                </div> */}
                                <div className='price'>
                                    <span>股票：{item.symbol}</span>
                                    <span>盈亏：<span className={item.pl >= 0 ? "update-down red" : "update-down green"}>{item.pl}</span></span>
                                </div>
                                <div className='price'>
                                    <span>数量：{item.volume}</span>
                                    <span>交易类型： <span className={item.buysell === '买' ? "update-down red" : "update-down green"}>{item.buysell}</span></span>
                                </div>
                                <div className='price'>
                                    <span>开仓时间：{item.opentime}</span>
                                    <span>开仓价格：{item.openPrice}</span>
                                </div>
                                <div className='price'>
                                    <span>平仓时间：{item.closetime}</span>
                                    <span>平仓价格：{item.closePrice}</span>
                                </div>
                               
                                
                                
                            </div>
                        )
                    })}
                </div>
            </div>

            {userId && Number(infoData.userId) !== userId ?
                <div className='footer'>
                    {infoData.subscriberState === 1 ?
                        <div className='follow-btn' style={{ 'background': "gray" }}>已跟单</div> :
                        <div className='follow-btn' onClick={navTrusteeship}>跟单</div>
                    }
                    {infoData.favoriteState === 1 ?
                        <div className='collect-btn' style={{ 'background': "gray" }} onClick={handleCancelCollect}>已收藏</div> :
                        <div className='collect-btn' onClick={handleCollect}>收藏</div>
                    }
                </div> : null
            }

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
        updateTrustData:(data)=>{
            dispatch(updateTrustData(data))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BacktestReport)