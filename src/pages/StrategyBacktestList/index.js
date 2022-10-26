import { useNavigate } from 'react-router-dom'
import './index.scss'

export default function BacktestList(){
    const navigate = useNavigate()

    const navToReport = ()=>{
        navigate('/backtestReport/123')
    }

    const navToTrust = ()=>{
        navigate('/strategyTrust')
    }

    return (
        <div className="backtest-list-wrapper">
            <div className="content">
                <div className="head-title">
                    <span>股票</span>
                    <span>累计收益</span>
                    <span>最大回测</span>
                    <span>操作</span>
                </div>
                <div className="backtest-item">
                    <span onClick={()=>navToReport()}>
                        <span>苏宁云上</span><br/><span className="code">002024</span>
                    </span>
                    <span className="red">16.26</span>
                    <span className="red">+10.05%</span>
                    <span>
                        <span className="trust-btn" onClick={()=>navToTrust()}>托管</span>
                    </span>
                  
                </div>
                <div className="backtest-item">
                    <span onClick={()=>navToReport()}>
                        <span>苏宁云上</span><br/><span className="code">002024</span>
                    </span>
                    <span className="red">16.26</span>
                    <span className="red">+10.05%</span>
                    <span>
                        <span className="trust-btn" onClick={()=>navToTrust()}>托管</span>
                    </span>
                  
                </div>
            </div>
        </div>
    )
}