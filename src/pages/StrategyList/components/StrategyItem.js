

import { useEffect, useRef } from "react"
import { Link } from 'react-router-dom'
import * as echarts from 'echarts';
import moment from "moment";

export default function StrategyItem(props) {
    const lineRef = useRef(null)
    let lineOption = {
        tooltip: {
            trigger: 'axis'
        },
        color: ['#FF5B3B', ],
        grid: {
            left: '5%',
            right: '4%',
            bottom: '3%',
            top: '10',
            containLabel: true
        },
        //x轴
        xAxis: {
            type: 'category',
            data: []
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
                name: '策略',
                type: 'line',
                smooth: true,
                symbol: 'none',
                data: [],

            },
           
        ]
    }
    useEffect(() => {
        renderLineChart()
    }, [])

    const renderLineChart = () => {
        let arr = []
        if (props.item.netValue) {
            arr = Object.entries(props.item.netValue).map(itemNet => {
                return {
                    value: itemNet[1],
                    date: moment(new Date(Number(itemNet[0]))).format('YYYY-MM-DD HH:mm')
                }
            })
        } 
        arr = arr.sort((a,b)=>{
            return b.date>a.date
        })
        console.log(arr)
        let date = []
        let data = []
        arr.forEach(item=>{
            date.push(item.date)
            data.push(item.value)
        })
        lineOption.xAxis.data = date
        lineOption.series[0].data = data
        const lineChart = echarts.init(lineRef.current)
        lineChart.setOption(lineOption)
    }

    return (
        <div className="data-item" >
            <div className="name-chart">
                <Link className="name-discribe" to={"/strategyRealReport/" + props.item.id}>
                    <div className="strategy-name">{props.item.hostingName}</div>

                    <div className="create">作者：{props.item.author}</div>
                    <div className="create">策略介绍：{props.item.description ? props.item.description : "暂无介绍"}</div>
                    {/* <div className="create">上线时间：{props.item.publishDate}</div> */}
                </Link>
                <div className="line-chart" ref={lineRef}>

                </div>
            </div>
            <div className="message-list">
                <div className="message-item">
                    <div className={props.item.maxDD>=0?"message red":"message green"}>{props.item.maxDD}%</div>
                    <div className="message-name">最大回测</div>
                </div>
                <div className="message-item">
                    <div className={props.item.monthYieldRate>=0?"message red":"message green"}>{props.item.monthYieldRate}%</div>
                    <div className="message-name">月收益</div>
                </div>
                <div className="message-item">
                    <div className={props.item.totalYieldRate>=0?"message red":"message green"}>{props.item.totalYieldRate}%</div>
                    <div className="message-name">年化收益</div>
                </div>
            </div>
        </div>
    )
}