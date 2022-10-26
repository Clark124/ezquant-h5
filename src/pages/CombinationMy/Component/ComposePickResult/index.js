
import { useEffect ,useState} from 'react'

import { Link ,useNavigate} from 'react-router-dom'
import './index.scss'

export default function ComposePickStockResult() {
    const navigate = useNavigate()
    const [result,setResult] = useState([])

    useEffect(()=>{
        const result = JSON.parse(localStorage.getItem("composePickStockResult"))
        setResult(result)
    },[])

    return (
        <div className="compose-pick-stock-result-wrapper">
            <div className="title">选股结果（共{result.length}只股票）</div>
            <div className="result-list">
               {
                   result.map((item,index)=>{
                       return (
                           <div className='result-item' key={index}>{item.prodName}({item.prodCode})</div>
                       )
                   })
               }
               
               
            </div>

            <div className="pick-stock-result-btn-wrapper">
                <div onClick={() => { navigate(-1)}} className="pick-stock-result-btn">上一步</div>
                <Link className="pick-stock-result-btn next" to="/composeCreate/tradeSet">
                    下一步
                </Link>

            </div>
        </div>
    )
}
