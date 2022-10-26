
import { useEffect, useState } from 'react'


export default function SubscibeList() {
    const [dataList, setDataList] = useState([1, 2, 3, 4, 5])
    const onCancelSubscribe = (e) => {

    }
    const navDetail = (item) => {

    }
    return (
        <div className='select-time-list'>
            {dataList.map((item, index) => {
                return (
                    <div className="select-time-item" key={index} onClick={() => {
                        navDetail(item)
                    }}>
                        <div className="strategy-info" >
                            <div className='strategy-name'>长期均线突破</div>
                            <div className='info'>
                                <span className='text'>平均涨幅:</span>
                                <span className='value'>45.00%</span>
                            </div>
                        </div>
                        <div className='btn-list'>
                            <div className="subscribe-btn" onClick={(e) => onCancelSubscribe(e, item)}>取消订阅</div>
                        </div>


                    </div>
                )
            })}
        </div>
    )
}