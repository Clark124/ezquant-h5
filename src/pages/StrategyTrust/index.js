
import { Radio, Stepper, Checkbox, Switch } from 'antd-mobile-v5'

import './index.scss'
import arrow_icon from '../../asstes/images/grarrow.png'

export default function StrategyTrust() {
    return (
        <div className="strategy-trust-wrapper">
            <div className="title">托管条件名称</div>
            <div className="strategy-name">
                M5对比试式_伊力特（600197.ss)
            </div>
            <div className="title">托管条件描述</div>
            <textarea className="discribe" placeholder="请输入不超过200个字符">

            </textarea>
            <div className="select-radio-wrapper">
                <Radio defaultChecked style={{ '--font-size': '14px' }}>发布策略</Radio>
                <div className="set-price">
                    <div className="set-price-title">设置策略跟单价格</div>
                    <Radio.Group defaultValue='orange' disabled>
                        <div style={{ marginBottom: '10px' }}>
                            <Radio value='apple' style={{ '--font-size': '14px', '--icon-size': '18px', }}>
                                <Stepper
                                    value={1}

                                    style={{
                                        '--input-font-color': "#222"
                                    }}
                                />
                            </Radio>
                        </div>
                        <div style={{ marginBottom: '10px', display: 'flex', alignItems: "center" }}>
                            <Radio value='free' style={{ '--font-size': '14px', '--icon-size': '18px', marginRight: '20px' }}>
                                <span>免费</span>
                            </Radio>
                            <input type="checkbox" checked onChange={() => { }} />   公布策略源码
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <input type="checkbox" />将该策略发布到策略排行榜，并允许其他用户进行跟单。允许他人跟单，系统会进行审核，请留意审核通知。
                        </div>


                    </Radio.Group>
                </div>
            </div>

            <div className="methods">
                <div className="method-name">交易方式</div>
                <div className="method-value">
                    <Radio.Group >
                        <Radio style={{ '--font-size': '14px' }}>自动模拟交易</Radio>
                        <Radio style={{ '--font-size': '14px' }}>仅提示交易信号</Radio>
                    </Radio.Group>
                </div>
            </div>
            <div className="methods">
                <div className="method-name">通知方式</div>
                <div className="method-value" style={{ marginBottom: 15 }}>
                    <span>系统通知（免费）</span>
                    <Switch

                        style={{
                         
                            '--height': '20px',
                            '--width': '40px',
                        }}
                    />
                </div>
                <div className="method-value">
                    <span>微信通知（限时免费）</span>
                    <Switch
                        style={{
                           
                            '--height': '20px',
                            '--width': '40px',
                        }}
                    />
                </div>
            </div>


            <div className="tips">
                提示：若发布策略，点确定即代表同意<span className="explain">《策略发布说明条款》</span>。策略发布后，将在策略超市中展示。
            </div>

            <div className="confirm-btn">
                确定
            </div>
        </div>
    )
}