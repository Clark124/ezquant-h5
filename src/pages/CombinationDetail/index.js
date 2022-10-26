import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as echarts from 'echarts';
import { comboDetail, comboSubscribe, comboSubscribeCancel } from '../../service/compose'
import { Dialog, Toast } from 'antd-mobile-v5'

import './index.scss'

const option = {

    tooltip: {
        trigger: 'item'
    },

    series: [
        {
            name: '仓位配置·',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 1048, name: '润和材料' },
                { value: 735, name: '泰和集团' },

            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
}

let lineOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 5,
        icon: "circle",
        data: ['组合',]
    },
    color: ['#266ED0', '#FE5958'],
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
            name: '组合',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],

        },
    ]
}

export default function CombinationDetail() {
    const params = useParams()
    const chartRef = useRef(null)
    const lineRef = useRef(null)
    const [oneBuyList, setoneBuyList] = useState([])
    const [twoBuyList, settwoBuyList] = useState([])
    const [report, setReport] = useState({})
    const [userId, setUserId] = useState("")

    useEffect(() => {
        getInit()
        // renderPostion()
        renderYield()

    }, [])

    const getInit = async () => {
        const id = params.id
        const userInfo = localStorage.getItem('userInfo')
        let userId = 0
        if (userInfo) {
            userId = JSON.parse(userInfo).id
        }
        setUserId(userId)

        //条件
        // let oneRes = await onePriorityCondition();
        // let twoRes = await twoPriorityCondition();
        // if (oneRes && oneRes.length > 0) {
        //     setoneBuyList(oneRes)
        // }
        // if (twoRes && twoRes.length > 0) {
        //     settwoBuyList(twoRes)
        // }
        //详情

        // let res1 = await comboInfoDetailEdit({ id: id });

        let report = await comboDetail({ id, userId })

        if (report.dayYieldRateLines.length > 0) {
            let date = []
            let data = []
            report.dayYieldRateLines.forEach((rate, index) => {
                date.push(rate.dataTime)
                data.push(rate.rate)
            })
            lineOption.xAxis.data = date
            lineOption.series[0].data = data
            renderYield()
        }

        setReport(report)

        // const { selectStockParameter, strategySetting, tradeSetting, selectTimeSetting, selectStockComboxInfo, riskSetting } = res1
        // let isEnable = 0
        // if (riskSetting) {
        //     isEnable = 1
        // }
        // let paramsData = {}
        // paramsData.paramA = JSON.parse(selectStockParameter.selectCondition)
        // paramsData.paramB = { strategySetting, tradeSetting }
        // paramsData.paramC = { selectTimeSetting }
        // paramsData.paramD = { selectStockComboxInfo, riskSetting, isEnable }
        // getParams(params.paramA);
    }

    const onSubscribe = () => {
        if (report && report.isSubscribe === 1) {
            handleCancelSub()
        } else {
            handleOnSub()
        }
    }
    const handleOnSub = () => {
        Dialog.confirm({
            title: "提示",
            content: (
                <>
                    <p>订阅组合后，每收到一条交易通知，系统化会从您的积分账户扣除10积分</p>
                </>
            ),
            onConfirm: async () => {
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })
                let res = await comboSubscribe({ isSubscribe: 1, userId, comboId: params.id });
                Toast.clear()
                if (res === 1) {
                    Toast.show({
                        icon: "success",
                        content: "订阅成功"
                    })
                    setReport({...report,isSubscribe:1})
                } else {
                    Toast.show({
                        icon: "fail",
                        content: "订阅失败"
                    })
                }
            }
        })
    }

    const handleCancelSub = () => {
        Dialog.confirm({
            title: '提示?',
            content: '你确定要取消订阅吗？',
            onConfirm: async () => {
                let res = await comboSubscribeCancel({ isSubscribe: 0, userId, comboId: params.id })
                if (res === 1) {
                    Toast.show({
                        icon: "success",
                        content: "已取消订阅"
                    })
                    setReport({...report,isSubscribe:0})
                } else {
                    Toast.show({
                        icon: "fail",
                        content: "取消订阅失败"
                    })
                }
            },
        });
    }

    const renderPostion = () => {
        const chartInstance = echarts.init(chartRef.current)
        chartInstance.setOption(option)
    }

    const renderYield = () => {
        const yieldChart = echarts.init(lineRef.current)
        yieldChart.setOption(lineOption)
    }

    return (
        <div className="combination-detail-wrapper">
            <div className='main-info'>
                <div className='info-item compose-name'>
                    <span>组合名称：</span>
                    <span style={{"color":"#083AEF"}}>{report.comboName}</span>
                </div>
                <div className='info-item'>
                    <span>初始资金：</span>
                    <span>{report.initFund/10000}万</span>
                </div>
                <div className='info-item'>
                    <span>作者：</span>
                    <span>{report.userName}</span>
                </div>
                <div className='info-item'>
                    <span>风格：</span>
                    <span>{report.comboStyle ? JSON.parse(report.comboStyle) : ""}</span>
                </div>
                <div className='info-item'>
                    <span>创建时间：</span>
                    <span>{report.gmtCreate}</span>
                </div>
                <div className='info-item'>
                    <span>策略描述：</span>
                    <span>{report.description}</span>
                </div>


            </div>
            {/* <div className='title'>组合规则</div>
            <div className='compose-set'>
                <div className='title'>选股条件</div>
                <div className='compose-set-item'>
                    <span>指定市场：</span>
                    <span>全市场</span>
                </div>
                <div className='compose-set-item'>
                    <span>行业市场：</span>
                    <span>全市场</span>
                </div>
                <div className='title'>交易设置</div>
                <div className='compose-set-item'>
                    <span>一级优先买入条件：</span>
                    <span>全市场</span>
                </div>
                <div className='compose-set-item'>
                    <span>二级优先买入条件：</span>
                    <span>全市场</span>
                </div>
                <div className='compose-set-item'>
                    <span>最大持股数量：</span>
                    <span>全市场</span>
                </div>
                <div className='compose-set-item'>
                    <span>单次买入比例：</span>
                    <span>全市场</span>
                </div>
                <div className='compose-set-item'>
                    <span>个股默认买入比例：</span>
                    <span>全市场</span>
                </div>
                <div className='compose-set-item'>
                    <span>单次买入比例不超过：</span>
                    <span>全市场</span>
                </div>
                <div className='compose-set-item'>
                    <span>单次卖出比例不超过：</span>
                    <span>全市场</span>
                </div>
                <div className='title'>交易策略：奥术大师多</div>
                <div className='compose-set-item'>
                    <span>策略描述：</span>
                    <span>全市场</span>
                </div>
                <div className='title'>大盘择时：不使用指标择时</div>
                <div className='title'>个股风控：不开启风控</div>
            </div> */}

            <div className='compose-set'>
                <div className='title'>收益统计</div>
                <div className='compose-set-item'>
                    <span>总收益：</span>
                    <span style={report.totalYieldRate>=0?{color:'red'}:{color:"green"}}>{report.totalYieldRate}%</span>
                </div>
                <div className='compose-set-item'>
                    <span>年化收益率：</span>
                    <span>{report.yearYieldRate}%</span>
                </div>
                <div className='compose-set-item'>
                    <span>实盘天数：</span>
                    <span>{report.day}</span>
                </div>
                <div className='compose-set-item'>
                    <span>收益风险比：</span>
                    <span>{report.yieldRiskRate}</span>
                </div>
                <div className='compose-set-item'>
                    <span>最大回测：</span>
                    <span>{report.retracement}</span>
                </div>
                <div className='compose-set-item'>
                    <span>胜率：</span>
                    <span>{report.successRate}</span>
                </div>
            </div>
            {/* 收益图 */}
            <div className="profit-chart-wrapper">
                <div className="profit-chart-title">
                    <span>收益曲线</span>
                </div>
                <div className="chart-list">
                    <div className="line-chart" ref={lineRef}></div>
                </div>
            </div>

            <div className='compose-set'>
                <div className='title'>当前持仓</div>
                <div className='current-position-head'>
                    <span style={{ flex: 1.5 }}>标的</span>
                    <span style={{ flex: 1.5 }}>日期</span>
                    <span>价格</span>
                    <span>仓位</span>
                    <span>盈亏</span>
                </div>
                {report.position ? report.position.map((item, index) => {
                    return (
                        <div className='current-position-item' key={index}>
                            <span style={{ flex: 1.5 }}>{`${item.stockName}(${item.stockCode})`}</span>
                            <span style={{ flex: 1.5 }}>{item.gmtCreate}</span>
                            <span>{item.positionAveragePrice}</span>
                            <span>{item.thisPositionQty + item.lastPositionQty}</span>
                            <span style={item.lossProfit>=0?{color:'red'}:{color:"green"}}>{item.lossProfit}</span>
                        </div>
                    )
                }) : null}

            </div>
            <div className='compose-set'>
                <div className='title'>历史记录</div>
                <div className='current-position-head'>
                    <span style={{ flex: 1.5 }}>标的</span>
                    <span>类型</span>
                    <span>数量</span>
                    <span style={{ flex: 1.5 }}>时间</span>
                    <span>价格</span>
                    <span>盈亏</span>
                </div>
                {report.tradeRecord ? report.tradeRecord.map((item, index) => {
                    return (
                        <div className='current-position-item' key={index}>
                            <span style={{ flex: 1.5 }}>{`${item.stockName}(${item.stockCode})`}</span>
                            <span style={item.direction===48?{color:'red'}:{color:"green"}}>{item.direction === 48 ? '买入' : '卖出'}</span>
                            <span>{item.tradeQty}</span>
                            <span style={{ flex: 1.5 }}>{item.gmtCreate}</span>
                            <span>{item.tradePrice}</span>
                            <span>{item.direction === 48 ? "--" : `${item.upRate}%`}</span>
                        </div>
                    )
                }) : null}

            </div>
            {userId !== report.userId ?
                <div className="footer-btn" onClick={onSubscribe} style={report && report.isSubscribe === 1?{background:'gray'}:{}}>
                    <span> {report && report.isSubscribe === 1 ? '已订阅' : '订阅'}</span>
                </div> : null
            }

            {/* <div className="main-info">
                <div className="profit-follow">
                    <div className="profit">
                        <span className="profit-text">总收益率</span>
                        <span className="profit-number">128.86%</span>
                    </div>
                    <div className="follow-number">50人跟单</div>
                </div>
                <div className="date-win">
                    <span className="date">创建时间：2017年4月1日</span>
                    <span className="win">该组合跑赢92.55%的组合</span>
                </div>
                <div className="info-data">
                    <div className="info-title">
                        <span>当前收益率</span>
                        <span>当月收益率</span>
                        <span>年化收益率</span>
                    </div>
                    <div className="info-number">
                        <span>22.83%</span>
                        <span>16.26%</span>
                        <span>10.05%</span>
                    </div>
                    <div className="info-title">
                        <span>最大回测</span>
                        <span>累计净值</span>
                        <span>胜率</span>
                    </div>
                    <div className="info-number">
                        <span>22.83%</span>
                        <span>16.26</span>
                        <span>2.289</span>
                    </div>

                </div>
            </div> */}

            {/* 策略介绍 */}
            {/* <div className="strategy-introduce">
                <div className="title">
                    <span className="title-text">策略介绍</span>
                    <span className="look-code-btn">查看源码</span>
                </div>
                <div className="author">
                    <img src="" className="avatar" alt="" />
                    <span className="author-name">小米乐</span>
                    <span className="provide">提供</span>
                </div>
                <div className="introduce">本策略采用量化多因子选股模型进行选股，结合证券CTA策略进行交易择时。</div>

                <div className="position">
                    <div className="position-head">
                        <span className="text">仓位配置</span>
                        <Link to="/combination/singleAnalysis" className="nav-analysis-btn" >个股收益分析></Link>
                    </div>
                    <div className="position-chart" ref={chartRef}>

                    </div>
                </div>

                <div className="position-info-list">
                    <div className="position-info-title">
                        <span>股票</span>
                        <span>涨跌幅</span>
                        <span>成本价</span>
                        <span>仓位</span>
                    </div>
                    <div className="position-info-data">
                        <div className="code-name">
                            <div className="name">润和材料</div>
                            <div className="code">300727</div>
                        </div>
                        <div className="green">-1.90%</div>
                        <div className="red">120.08</div>
                        <div>60%</div>
                    </div>
                    <div className="position-info-data">
                        <div className="code-name">
                            <div className="name">润和材料</div>
                            <div className="code">300727</div>
                        </div>
                        <div className="green">-1.90%</div>
                        <div className="red">120.08</div>
                        <div>60%</div>
                    </div>
                </div>
            </div> */}



            {/* 最新调仓 */}
            {/* <div className="latest-position">
                <div className="latest-position-block">
                    <div className="head">
                        <div>
                            <span className="head-text">最新调仓</span>
                            <span className="head-date">（2018-01-19 10:26）</span>
                        </div>
                        <Link to="/combination/adjustPosition" className="nav-history">历史调仓></Link>
                    </div>
                    <div className="positon-info">
                        <div className="position-title">
                            <span>股票</span>
                            <span>调仓方向</span>
                            <span>仓位变化</span>
                            <span>调仓价格</span>
                        </div>
                        <div className="position-data">
                            <div>
                                <div>任何材料</div>
                                <div>300727</div>
                            </div>
                            <div>买入</div>
                            <div>0%~62.5%</div>
                            <div>35.12</div>
                        </div>

                        <div className="reason">
                            <span className="reason-title">调仓理由：</span>
                            <span className="reason-text">基本面和技术面均符合买入条件</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tips">
                风险提示：投资有风险，组合信号不对您构成任何投资建议，据此操作，风险自担。
            </div> */}

            {/* 底部按钮 */}

        </div>
    )
}