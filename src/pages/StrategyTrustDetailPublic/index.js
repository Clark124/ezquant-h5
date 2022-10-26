
import './index.scss'
import { Switch, Radio } from 'antd-mobile-v5'
import {Link,useNavigate} from 'react-router-dom'
import arrow_icon from '../../asstes/images/grarrow.png'

export default function TrustDetailPublic() {
    const navigate = useNavigate()
    return (
        <div className="trust-detail-wrapper">
            <div className="strategy-content">
                <div className="strategy-name">
                    长期均线突破
                </div>
                <div className="strategy-type">
                    <span>交易标的</span>
                    <span>恒生电子（600570）</span>
                </div>
                <div className="strategy-type">
                    <span>收益率</span>
                    <span>5.12%</span>
                </div>
                <div className="strategy-type">
                    <span>频率</span>
                    <span>1日</span>
                </div>
                <div className="strategy-type">
                    <span>运行状态</span>
                    <Switch
                        style={{

                            '--height': '20px',
                            '--width': '40px',
                        }}
                    />
                </div>
                <div className="strategy-type">
                    <span>发布时间</span>
                    <span>2017-07-03</span>
                </div>
                <div className="strategy-type" onClick={()=>{
                    navigate('/strategyTrustDetailPublic/followList/123')
                }}>
                    <span>跟单人数</span>
                    <span style={{display:"flex",alignItems:"center"}}>
                        <span style={{color:"#083AEF"}}>23</span><img src={arrow_icon} alt="" style={{width:14,marginLeft:10}}/>
                    </span>
                </div>
                
                
            </div>

            <div className="my-strategy-detail-btn-wrapper">
                <div style={{background:"#BBBBBB",width:'100%'}}>删除</div>
            </div>

        </div>
    )
}