import { useRef, useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as echarts from 'echarts';
import { Modal ,Stepper} from 'antd-mobile-v5'
import './index.scss'


const lineOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 5,
        icon: "circle",
        data: ['用户累计收益率', '大盘累计收益率',]
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
        data: ["20年1月", "20年2月", "20年3月", "20年4月", "20年5月", "20年6月"]
    },
    yAxis: {},
    series: [
        {
            name: '用户累计收益率',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [0, 30, 40, 50, 80, 70],

        },
        {
            name: '大盘累计收益率',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [0, 20, 40, 60, 70, 90],

        }
    ]
}

export default function StrategyDetail() {
    const lineRef = useRef(null)
    const [showFollowModal, setShowFollowModal] = useState(false)
    const [buyNum,setBuyNum] = useState(1)
    useEffect(() => {

        renderYield()

    }, [])

    const renderYield = () => {
        const yieldChart = echarts.init(lineRef.current)
        yieldChart.setOption(lineOption)
    }

    const payment = ()=>{
        setShowFollowModal(false)
    }
    return (
        <div className="strategy-detail-wrapper">
            <div className="main-info">
                <div className="total-profit">
                    <div>
                        <div style={{ marginBottom: 5 }}>
                            <span className="number">81.25%</span>
                            <span className="text">总收益率</span>
                        </div>
                        <div className="create-date">
                            创建时间：2017年4月1日
                        </div>
                    </div>
                    <Link className="backtext-btn" to="/backtestReport/123">回测报告</Link>
                </div>
                <div className="info-list">
                    <div className="list-head">
                        <span>当月收益率</span>
                        <span>近半年收益率</span>
                        <span>年化收益率</span>
                    </div>
                    <div className="list-date">
                        <span>11.83%</span>
                        <span>16.26</span>
                        <span className="red">+10.05%</span>
                    </div>
                </div>
                <div className="info-list">
                    <div className="list-head">
                        <span>当月收益率</span>
                        <span>近半年收益率</span>
                        <span>年化收益率</span>
                    </div>
                    <div className="list-date">
                        <span>11.83%</span>
                        <span>16.26</span>
                        <span className="red">+10.05%</span>
                    </div>
                </div>
            </div>

            <div className="strategty-introduce">
                <div className="title">
                    <span>策略介绍</span>
                    <span className="look-btn">查看源码</span>
                </div>
                <div className="user">
                    <img src="" className="avatar" alt="" />
                    <span className="username">缠中解盘</span>
                    <span className="text">提供</span>
                </div>
                <div className="introduce">
                    本策略采用量化多因子选股模型进行选股，结合证券CTA策略进行交易择时。
                </div>

                <div className="info-list">
                    <div className="list-head">
                        <span>当月收益率</span>
                        <span>近半年收益率</span>
                        <span>年化收益率</span>
                    </div>
                    <div className="list-date">
                        <span>11.83%</span>
                        <span>16.26</span>
                        <span className="red">+10.05%</span>
                    </div>
                </div>
                <div className="info-list">
                    <div className="list-head">
                        <span>当月收益率</span>
                        <span>近半年收益率</span>
                        <span>年化收益率</span>
                    </div>
                    <div className="list-date">
                        <span>11.83%</span>
                        <span>16.26</span>
                        <span className="red">+10.05%</span>
                    </div>
                </div>
            </div>

            {/* 收益图 */}
            <div className="profit-chart-wrapper">
                <div className="profit-chart-title">
                    <span>收益图</span>
                </div>
                <div className="chart-list">
                    <div className="chart-head-tab">
                        <span className="active">30天</span>
                        <span>6个月</span>
                        <span>1年</span>
                    </div>
                    <div className="line-chart" ref={lineRef}></div>

                </div>
            </div>

            {/* 持仓 */}
            <div className="hold-position">
                <div className="title">
                    持仓
                </div>
                <div className="hold-list">
                    <div className="hold-list-head">
                        <span>股票</span>
                        <span>涨跌幅</span>
                        <span>成本价</span>
                        <span>仓位</span>
                    </div>
                    <div className="hold-data-list">
                        <div className="code-name">
                            <div className="stock-name">格力电器</div>
                            <div className="stock-code">002024</div>
                        </div>
                        <div className="update-down green">-1.60%</div>
                        <div className="price red">120.08</div>
                        <div className="position">30%</div>
                    </div>
                </div>
            </div>

            {/* 交易记录 */}
            <div className="hold-position">
                <div className="title">
                    交易记录
                </div>
                <div className="hold-list">
                    <div className="hold-list-head">
                        <span>股票</span>
                        <span>买卖</span>
                        <span>价格</span>
                        <span className="date">时间</span>
                    </div>
                    <div className="hold-data-list">
                        <div className="code-name">
                            <div className="stock-name">格力电器</div>
                            <div className="stock-code">002024</div>
                        </div>
                        <div className="update-down green">买入</div>
                        <div className="price red">120.08</div>
                        <div className="date">2017-05-07 14:32</div>
                    </div>
                    <div className="hold-data-list">
                        <div className="code-name">
                            <div className="stock-name">格力电器</div>
                            <div className="stock-code">002024</div>
                        </div>
                        <div className="update-down green">买入</div>
                        <div className="price red">120.08</div>
                        <div className="date">2017-05-07 14:32</div>
                    </div>
                    <div className="hold-data-list">
                        <div className="code-name">
                            <div className="stock-name">格力电器</div>
                            <div className="stock-code">002024</div>
                        </div>
                        <div className="update-down green">买入</div>
                        <div className="price red">120.08</div>
                        <div className="date">2017-05-07 14:32</div>
                    </div>
                </div>
            </div>

            <div className="footer">
                <div className="follow-btn" onClick={() => {
                    Modal.show({
                        title: '提示',
                        content: '您现在使用的是价值260元/月的策略订阅服务，目前免费使用。',
                        closeOnAction: true,
                        actions: [
                            {
                                key: "confrim",
                                text: '确定',
                                primary: true,
                                onClick: () => {
                                    setShowFollowModal(true)
                                }
                            },

                        ],
                    })
                }}>订阅<br></br>300元/月</div>
                <div className="collect-btn">收藏</div>
            </div>

            <Modal
                visible={showFollowModal}
                title={'跟单'}
                content={(
                    <div>
                        <div className="follow-modal-item">
                            <span className="follow-modal-item-name">策略名称</span>
                            <span className="follow-modal-item-value">龙抬头</span>
                        </div>
                        <div className="follow-modal-item">
                            <span className="follow-modal-item-name">跟单价格</span>
                            <span className="follow-modal-item-value">￥200元/月</span>
                        </div>
                        <div className="follow-modal-item">
                            <span className="follow-modal-item-name">购买数量(月)</span>
                            <Stepper
                                value={buyNum}
                                onChange={value => {
                                    if(value<1){
                                        return
                                    }
                                    setBuyNum(value)
                                
                                }}
                            />
                        </div>
                        <div className="follow-modal-item">
                            <span className="follow-modal-item-name">合计</span>
                            <span className="follow-modal-item-value">400元</span>
                        </div>
                        <div className="total-wrapper">
                            <span style={{marginRight:20}}>应付</span>
                            <span>400元</span>
                        </div>
                        <div className="tips">
                            <span>提示：点击支付即代表同意</span>
                            <span className="introduction">《策略购买免责说明条款》</span>
                        </div>
                    </div>
                )}
                closeOnMaskClick={true}
                onClose={() => {
                    setShowFollowModal(false)
                }}
                actions={[
                    {
                        primary: true,
                        key: 'confirm',
                        text: '支付',
                        onClick:payment
                    },
                ]}
            />




        </div>
    )
}