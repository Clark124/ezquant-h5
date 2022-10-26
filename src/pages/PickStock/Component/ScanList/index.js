import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { scanList } from '../../../../service/pickStock'
import { connect } from 'react-redux'
import { Dialog, Toast } from 'antd-mobile-v5'
import { scanSignalList } from '../../../../service/strategy'

const periodList = {
    1: "1分钟",
    2: "5分钟",
    3: "15分钟",
    4: "30分钟",
    5: "1小时",
    6: '1日',
}

function ScanList(props) {
    const [dataList, setDataList] = useState([])


    const navigate = useNavigate()
    const navScanDetail = (item) => {
        localStorage.setItem("scanDetail", JSON.stringify(item))
        navigate('/scanDetail/' + item.id)
    }

    useEffect(() => {
        onGetList()
    }, [])

    const onGetList = () => {
        const userId = JSON.parse(localStorage.getItem("userInfo")).id
        const data = {
            scanType: props.marketType === 0 ? 1 : 2
        }
        scanList(userId, data).then(res => {
            setDataList(res)
        })

    }

    const onScanItem = (item) => {
        Dialog.confirm({
            title: "提示",
            content: (
                <>
                    <p>实时扫描会从您的账户扣除10积分，是否确定进行实时扫描？</p>
                </>
            ),
            onConfirm: () => {
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })

                scanSignalList({ id: item.id }).then(res => {
                    Toast.clear()
                    localStorage.setItem('scanResult', JSON.stringify(res))
                    navigate('/scanResult/1')
                })

            }
        })
    }

    return (
        <div className="select-time-list">

            <Link className="create-btn" to="/scanCreate">+ 新建扫描</Link>
            {dataList.map((item, index) => {
                return (
                    <div className="scan-item" key={item.id}>
                        <div onClick={() => navScanDetail(item)}>
                            <div className="strategy-name" >{item.scanName}</div>
                            <div className="info-item">
                                <span className="info-name">状态：</span>
                                <span className="info-value">{item.scanStatus === 'Stop' ? '停止' : '运行'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-name">扫描频率：</span>
                                <span className="info-value">{periodList[item.period]}</span>
                            </div>

                        </div>

                        <div className="signal-btn" onClick={() => onScanItem(item)}>实时扫描</div>

                    </div>
                )
            })}

            {dataList.length === 0 ?
                <div className='no-data'>暂无数据</div> : null
            }


        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        marketType: state.traderoom.marketType,
    };
}
export default connect(mapStateToProps, null)(ScanList)