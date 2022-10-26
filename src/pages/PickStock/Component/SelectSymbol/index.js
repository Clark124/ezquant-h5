
import { useNavigate } from 'react-router-dom'
import { Radio } from 'antd-mobile-v5'
import './index.scss'

export default function SelectSymbol() {
    const navigate = useNavigate()

    const navToSet = ()=>{
        navigate('/backtestSet/123?type=multiple')
    }
    return (
        <div className="select-symbol-wrapper">
            <div className="title">选择要策略回测的股票</div>
            <div className="content">
                <div className="head-title">
                    <span style={{flex:0.5}}></span>
                    <span>股票</span>
                    <span>现价</span>
                    <span>涨跌幅</span>
                </div>
                <Radio.Group>
                    <div className="symbol-item">
                        <div style={{flex:0.5}}><Radio value='1' ></Radio></div>
                        <div>
                            <div>苏宁云商</div>
                            <div className="symbol-code">002024</div>
                        </div>
                        <div className="price">16.26</div>
                        <div className="profit red">+10.05%</div>
                    </div>
                    <div className="symbol-item">
                        <div style={{flex:0.5}}><Radio value='2' ></Radio></div>
                        <div>
                            <div>苏宁云商</div>
                            <div className="symbol-code">002024</div>
                        </div>
                        <div className="price">16.26</div>
                        <div className="profit red">+10.05%</div>
                    </div>

                </Radio.Group>

            </div>

            <div className="confirm-btn" onClick={navToSet}>选择股票</div>
        </div>
    )
}