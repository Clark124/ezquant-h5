import {Link} from 'react-router-dom'
import './index.scss'

export default function RecommendSelection() {
    return (
        <div className="recommend-selection-wrapper">
            <Link className="recommend-item" to={`/selectionResult/123`}>
                <div className="message">
                    <div className="select-title">
                        <span className="select-name">皇冠明珠</span>
                        <span className="price">50元/月</span>
                    </div>
                    <div className="discribe">
                        根据十年以上价值投资者的研究定制，并通过人工筛选的高成长的价值股。
                    </div>
                </div>
                <div className="value">
                    <div className="number">8.23%</div>
                    <div className="text">平均涨幅</div>
                </div>
            </Link>
            <Link className="recommend-item" to={`/selectionResult/123`}>
                <div className="message">
                    <div className="select-title">
                        <span className="select-name">皇冠明珠</span>
                        <span className="price free">限时免费</span>
                    </div>
                    <div className="discribe">
                        根据十年以上价值投资者的研究定制，并通过人工筛选的高成长的价值股。
                    </div>
                </div>
                <div className="value">
                    <div className="number green">8.23%</div>
                    <div className="text">平均涨幅</div>
                </div>
            </Link>
        </div>
    )
}