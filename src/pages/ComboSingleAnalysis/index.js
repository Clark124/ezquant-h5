import './index.scss'

export default function ComboSingleAnalysis(){
    return (
        <div className="single-analysis">
            <div className="net-value">
                <span>组合净值</span>
                <span className="value">2.289</span>
            </div>
            <div className="single-profit">
                <div className="title">个股收益贡献</div>
                <div className="profit-item">
                    <div className="profit-value">
                        <span>1 任何材料</span>
                        <span>1.306</span>
                    </div>
                    <div className="progress">
                        <div style={{flex:0.8,background:"#1573CB"}} ></div>
                        <div style={{flex:0.2,background:"#e5e5ef"}}></div>
                    </div>
                </div>
                <div className="profit-item">
                    <div className="profit-value">
                        <span>2 泰禾集团</span>
                        <span>0.983</span>
                    </div>
                    <div className="progress">
                        <div style={{flex:0.5,background:"#FCAC11"}} ></div>
                        <div style={{flex:0.5,background:"#e5e5ef"}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}