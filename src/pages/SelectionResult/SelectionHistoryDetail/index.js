import './index.scss'

export default function SelectionHistoryDetail() {
    return (
        <div className="select-history-detail-wrapper">
            <div className="list-wrapper">
                <div className="list-title">
                    <div>股票</div>
                    <div>推荐价格</div>
                    <div>距今涨跌幅</div>
                </div>
                <div className="list-item">
                    <div>
                        <div className="stock-name">苏宁云商</div>
                        <div className="stock-code">002024</div>
                    </div>
                    <div className="price">16.26</div>
                    <div className="change-rate">+10.05%</div>
                </div>
                <div className="list-item">
                    <div>
                        <div className="stock-name">苏宁云商</div>
                        <div className="stock-code">002024</div>
                    </div>
                    <div className="price">16.26</div>
                    <div className="change-rate">+10.05%</div>
                </div>
            </div>
        </div>
    )
}