import { useState, useEffect } from 'react'
import '../index.scss'

export default function ParamDetail(props) {
    const [paramsDetail, setParamsDetail] = useState({})
    let [sp, setSp] = useState([])

    useEffect(() => {
        let paramsDetail = localStorage.getItem('paramsDetail')
        paramsDetail = JSON.parse(paramsDetail)
        const sp = JSON.parse(paramsDetail.sp)

        setParamsDetail(paramsDetail)
        setSp(sp)

    }, [])

    const handleChangeVlaue = (e, i) => {
        let arr = JSON.parse(JSON.stringify(sp))
        arr[i].value = e.target.value
        setSp(arr)
    }

    return (
        <div className="param-detail-wrapper">
            <div className='params-name'>{paramsDetail.value}</div>

            {sp.map((item, index) => {
                return (
                    <div key={item.name} className="sp-item">
                        <span>{item.label}:</span>
                        <input className="sp-item-input"
                            onChange={e => {
                                handleChangeVlaue(e, index);
                            }}
                            value={item.value}
                        />
                    </div>
                )
            })}

            <div className='select-area'>
                <span>区间</span>




            </div>

            <div className='input-list'>
                <span>自定义</span>

                <div className='input-area'>
                    <input type="text" /> --

                    <input type="text" />
                </div>


            </div>

        </div>
    )
}