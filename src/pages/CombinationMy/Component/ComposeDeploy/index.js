
import { Link } from 'react-router-dom'

export default function ComposeDeploy() {
    return (
        <div className="data-list-wrapper">
            <div className="data-title-list">
                <div className="data-title">名称</div>
                <div className="data-title">跟单人数</div>
                <div className="data-title">总收益</div>
            </div>
            <Link className="data-item" to="/combination/2">
                <div className="userinfo">
                    <div className="strategy">
                        <div className="strategy-name">明珠盛宴</div>
                    </div>
                    <div className="user">
                        <img src={require('../../../../asstes/images/default.jpeg')} alt="" className="avatar" />
                        <span className="username">木头不呆</span>
                    </div>
                </div>
                <div className="year-rate ">5</div>
                <div className="total-rate">
                    <span className="number red">1.18%</span>
                </div>
            </Link>
            <Link className="data-item" to="/combination/2">
                <div className="userinfo">
                    <div className="strategy">
                        <div className="strategy-name">明珠盛宴</div>
                    </div>
                    <div className="user">
                        <img src={require('../../../../asstes/images/default.jpeg')} alt="" className="avatar" />
                        <span className="username">木头不呆</span>
                    </div>
                </div>
                <div className="year-rate">5</div>
                <div className="total-rate">
                    <span className="number red">1.18%</span>
                </div>
            </Link>
        </div>
    )
}