import { useState } from 'react'
import './index.scss'

export default function ClassicList(){
    const [rangeList,] = useState(['全部市场','上海A股','深圳A股','创业板','中小板'])
    const [rangeIndex,setRangeIndex] = useState(0)
    const [classicList,setClassicList] = useState([1,2,3])

    const changeRange = (index)=>{
        setRangeIndex(index)
    }
    return (
        <div className="classic-list-wrapper">
            <div className="title">选股范围</div>
            <div className="range-wrapper">
               
                <div className='range-list'>
                    {rangeList.map((item,index)=>{
                        return (
                            <div className={rangeIndex===index?'range-item active':'range-item'} key={index} 
                                onClick={()=>changeRange(index)}
                            >{item}</div>
                        )
                    })}
                </div>
            </div>
            <div className="title">经典选股</div>
            <div className='classic-list'>
                {classicList.map((item,index)=>{
                    return (
                        <div key={index} className="classic-item">
                            <div>   
                                <div className='strategy-name'>长期均线突破</div>
                                <div className=''>
                                    <span className='text'>平均涨幅：</span>
                                    <span className='value'>45.00%</span>
                                </div>
                            </div>
                            <div className='subcribe-btn'>订阅</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}