import { useState } from 'react'
import { Radio, Stepper } from 'antd-mobile-v5'

import './index.scss'
export default function StrategyTrustPublic() {
    const [num, setNum] = useState(1)


    return (
        <div className="strategy-trust-public-wrapper">
            <div className="content">
                <div className="set-price-title">设置策略跟单价格</div>
                <Radio.Group defaultValue={1} >
                    <div style={{ marginBottom: '15px' }}>
                        <Radio value={1} style={{ '--font-size': '14px', '--icon-size': '18px', }}>
                            <Stepper
                                value={num}
                                onChange={value => {
                                    setNum(value)
                                }}
                            />
                        </Radio>
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: "center" }}>
                        <Radio value={2} style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '20px' }}>
                            <span>免费</span>
                        </Radio>
                        <input type="checkbox" checked onChange={() => { }} />   公布策略源码
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <input type="checkbox" />
                    </div>
                </Radio.Group>
            </div>
            <div className="tip">
                提示：点击确定即代表同意<span>《易量化策略发布说明条款》</span>
            </div>
            <div className="confirm-btn">确定</div>
        </div>
    )
}