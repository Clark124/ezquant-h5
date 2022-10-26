
import './index.scss'
export default function FollowList(){
    return (
        <div className="follow-list-wrapper">
            <div className="content">
                <div className="head-title">
                    <span>序号</span>
                    <span>跟单人</span>
                    <span style={{flex:2.2}}>跟单起始时间</span>
                </div>
                <div className="follow-item">
                    <span>1</span>
                    <span>小苹果</span>
                    <span style={{flex:2.2}}>2017-07-04~2017-09-03</span>
                </div>
                <div className="follow-item">
                    <span>1</span>
                    <span>小苹果</span>
                    <span style={{flex:2.2}}>2017-07-04~2017-09-03</span>
                </div>
            </div>
        </div>
    )
}