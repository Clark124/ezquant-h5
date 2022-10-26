import {Link} from 'react-router-dom'
import './index.scss'
import arrow_icon from '../../../asstes/images/grarrow.png'

export default function SelectionHistory(){
    return(
        <div className="select-history-wrapper">
            <Link className="history-item" to="/selectionHistoryDetail/123">
                <div>2018-01-11</div>
                <div className="right">
                    <span>13只 </span>
                    <img src={arrow_icon} alt="" className="arrow-icon"/>
                </div>
            </Link>
            <div className="history-item">
                <div>2018-01-11</div>
                <div className="right">
                    <span>13只 </span>
                    <img src={arrow_icon} alt="" className="arrow-icon"/>
                </div>
            </div>
        </div>
    )
}