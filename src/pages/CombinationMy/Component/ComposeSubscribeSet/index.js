
import {Switch} from 'antd-mobile-v5'
import './index.scss'

export default function ComposeSubscribeSet() {
    return (
        <div className="compose-subscibe-set-wrapper">
            <div className="content">
                <div className="set-item">
                    <span>组合名称</span>
                    <span>超跌低估值</span>
                </div>
                <div className="set-item">
                    <span>跟单价格</span>
                    <span>¥50/月</span>
                </div>
                <div className="set-item">
                    <span>开始日期</span>
                    <span>2018年3月14日</span>
                </div>
                <div className="set-item">
                    <span>结束日期</span>
                    <span>2018年3月14日</span>
                </div>

                <div className="title">通知方式</div>
                <div className="strategy-type-method">

                    <div className="method-value" >
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
            </div>
        </div>
    )
}