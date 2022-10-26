import { useRef, useEffect } from 'react'
import * as echarts from 'echarts';
import './index.scss'

const option = {
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['组合', '沪深300']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '40',
        containLabel: true
    },
    color: ['#FF5B3B', '#19A4F4'],
    xAxis: [
        {
            type: 'category',
            data: ['2017-06', '2017-07', '2017-08', '2017-09', '2017-10']
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                formatter: (value) => {
                    return `${value}%`
                }
            },
        }
    ],
    series: [
        {
            name: '组合',
            type: 'bar',
            data: ['5', '-5', '15', '20', '22'],
        },
        {
            name: '沪深300',
            type: 'bar',
            data: ['-5', '3', '7', '-6', '6'],
        }
    ]
}

const lineOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 5,
        // icon: "circle",
        data: ['组合', '沪深300',]
    },
    color: ['#FF5B3B', '#19A4F4'],
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
    yAxis: {
        axisLabel: {
            formatter: (value) => {
                return `${value}%`
            }
        },
    },
    series: [
        {
            name: '组合',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [0, 30, 40, 50, 80, 70],

        },
        {
            name: '沪深300',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [0, 20, 40, 60, 70, 90],

        }
    ]
}

export default function ComboTotalAnalysis() {
    const barRef = useRef(null)
    const lineRef = useRef(null)

    useEffect(() => {
        renderMonthAnslysis()
        renderYield()
    }, [])

    const renderMonthAnslysis = () => {
        const barChart = echarts.init(barRef.current)
        barChart.setOption(option)
    }

    const renderYield = () => {
        const yieldChart = echarts.init(lineRef.current)
        yieldChart.setOption(lineOption)
    }

    return (
        <div className="combo-total-analysis">
            <div className="block-anslysis">
                <div className="title">月度收益分析</div>
                <div className="chart-wrapper" ref={barRef}></div>
            </div>
            <div className="block-anslysis">
                <div className="title">最大回测</div>
                <div className="chart-wrapper" ref={lineRef}></div>
            </div>

        </div>
    )
}