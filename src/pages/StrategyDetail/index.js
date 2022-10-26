import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import './index.scss'
import moment from 'moment'
import { Dialog, Toast } from 'antd-mobile-v5'

import { strategyListDelete } from '../../service/strategy'


export default function StrategyDetail() {
    const params = useParams()
    const navigate = useNavigate()
    const [detail, setDetail] = useState({
        name: "",
        updateDate: "",
        description: "",
        id: "",
        type: "",
    })

    useEffect(() => {
        let detail = localStorage.getItem('strategyDetail')
        if (detail) {
            detail = JSON.parse(detail)
            setDetail(detail)
        }
    }, [])

    const onDelete = () => {
        Dialog.confirm({
            content: "确定要删除吗？",
            onConfirm: () => {
                const id = params.id
                strategyListDelete({ id: id }).then(res => {
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: "success",
                            content: "删除成功",
                            afterClose: () => {
                                navigate(-1)
                            }
                        })

                    } else {
                        Toast.show({
                            icon: "fail",
                            content: res.message,
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        })
    }


    const onNavEdit = ()=>{
        navigate('/strategyEdit/'+detail.id)
    }
    return (
        <div className="my-strategy-detail-wrapper">
            <div className="strategy-content">
                <div className="strategy-name">{detail.name}</div>

                <div className="strategy-type">
                    <span>类型</span>
                    <span>{detail.type === 1 ? '搭建' : '编写'}</span>
                </div>
                <div className="strategy-type">
                    <span>最后修改时间</span>
                    <span>{moment(detail.updateDate).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <div className="discribe">
                    <div>介绍</div>
                    <div className="text">
                        {detail.description}
                    </div>
                </div>
            </div>
            <div className="my-strategy-detail-btn-wrapper">
                <div style={{ background: "#BBBBBB" }} onClick={onDelete}>删除策略</div>
                {detail.type === 1 ? <div onClick={onNavEdit}>编辑策略</div> : null}

                <Link to={'/backtestSet/' + detail.id}>回测</Link>
            </div>
        </div>
    )
}