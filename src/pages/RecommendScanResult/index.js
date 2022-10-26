import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

export default function SelectionDetail() {
    const [result, setResult] = useState({
        scanDetails: []
    })

    useEffect(() => {
        let result = localStorage.getItem('recommendScanResult')
        result = JSON.parse(result)
        setResult(result)
        console.log(result)
    }, [])

    return (
        <div className="selection-detail-wrapper">
            <div className="discribe-wrapper">
                <div className="strategy-name">{result.scanName}</div>
                <div className="discribe">
                    {result.scanDescription}
                </div>
                <div className="date">
                    {result.scanSortDate}
                </div>
            </div>
            <div className="result-list-wrapper">
                <div className="result-list">
                    <div className="list-head">
                        <div>扫描结果（共{result.scanDetails.length}只股票）</div>
                        {/* <Link className="nav-history" to="/selectionHistory/123">历史记录></Link> */}
                    </div>
                    <div className="list-wrapper">
                        <div className="list-title">
                            <div>股票</div>
                            <div>现价</div>
                            <div>涨跌幅</div>
                        </div>
                        {result.scanDetails.map((item, index) => {
                            return (
                                <div className="list-item" key={index}>
                                    <div>
                                        <div className="stock-name">{item.prodName}</div>
                                        <div className="stock-code">{item.prodCode}</div>
                                    </div>
                                    <div className="price">{item.lastPrice}</div>
                                    <div className={item.pxChangeRate>=0?"change-rate":"change-rate green"}>{item.pxChangeRate}%</div>
                                </div>
                            )
                        })}


                    </div>

                </div>
            </div>

        </div>
    )
}