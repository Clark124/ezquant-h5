import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './index.scss'
import { Switch, Radio, Dialog, Toast } from 'antd-mobile-v5'
import { Link } from 'react-router-dom'
import { stopComboId, runComboId, updateCombinationOrder, changeNoticeCombo, comboInfoPublic, comboInfoSubscribeDelete } from '../../../../service/compose'
import { connect } from 'react-redux'
import { changeFirstEditStatus } from '../../actions'
import { isSubGZH } from '../../../../utils'

const periodList = {
    1: "1分钟",
    2: "5分钟",
    3: "15分钟",
    4: "30分钟",
    5: "1小时",
    6: '1日',
}

function ComposeItemDetail(props) {

    const params = useParams()
    const navigate = useNavigate()
    const [detail, setDetail] = useState({

    })

    useEffect(() => {
        let detail = localStorage.getItem('composeItemDetail')
        if (detail) {
            detail = JSON.parse(detail)
            setDetail(detail)
        }
    }, [])

    //修改通知方式
    const onChangeNotice = (type, checked) => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
        let data = {
            userId: userInfo.id,
            singalTypeId: 3,
            singalSourceId: detail.id,
            isWeixinNotice: detail.isWeixinNotice,
            isSystemNotice: detail.isSystemNotice,
        }
        if (type === 'system') {
            data.isSystemNotice = checked ? '1' : '0'
        } else if (type === 'weixin') {
            data.isWeixinNotice = checked ? '1' : '0'
        }
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0
        })
        changeNoticeCombo(data).then(res => {
            Toast.clear()
            if (res.code === 200) {
                setDetail({ ...detail, isWeixinNotice: data.isWeixinNotice, isSystemNotice: data.isSystemNotice })
                let dataDetail = JSON.parse(localStorage.getItem('composeItemDetail'))
                dataDetail.isSystemNotice = data.isSystemNotice
                dataDetail.isWeixinNotice = data.isWeixinNotice
                localStorage.setItem("composeItemDetail", JSON.stringify(dataDetail))
            }
        })
    }

    //修改状态
    const changeStatus = () => {
        if (detail.comboStatus === 1) {
            Toast.show({
                icon: "loading",
                content: "加载中...",
                duration: 0,
                maskClickable: false
            })
            stopComboId({ id: detail.id }).then(res => {
                Toast.clear()
                setDetail({ ...detail, comboStatus: 2 })
                let data = JSON.parse(localStorage.getItem('composeItemDetail'))
                data.comboStatus = 2
                localStorage.setItem("composeItemDetail", JSON.stringify(data))

            })
        } else {
            Toast.show({
                icon: "loading",
                content: "加载中...",
                duration: 0,
                maskClickable: false
            })
            runComboId({ id: detail.id }).then(res => {
                Toast.clear()
                setDetail({ ...detail, comboStatus: 1 })
                let data = JSON.parse(localStorage.getItem('composeItemDetail'))
                data.comboStatus = 1
                localStorage.setItem("composeItemDetail", JSON.stringify(data))
            })
        }
    }

    //修改交易状态
    const changeIsOrder = (e) => {
        const data = {
            id: detail.id,
            value: e
        }
        Toast.show({
            icon: "loading",
            content: "加载中...",
            duration: 0,
            maskClickable: false
        })
        updateCombinationOrder(data).then(res => {
            Toast.clear()
            setDetail({ ...detail, isOrder: e })
            let data = JSON.parse(localStorage.getItem('composeItemDetail'))
            data.isOrder = e
            localStorage.setItem("composeItemDetail", JSON.stringify(data))
        })
    }

    const onPublic = (value) => {
        let content = ""
        let toastText = ""
        if (value === 1) {
            content = "确定要公开组合吗"
            toastText = '组合公开成功'
        } else {
            content = "要取消公开组合吗"
            toastText = '取消公开组合成功'
        }
        Dialog.confirm({
            title: "",
            content: content,
            onConfirm: () => {
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })
                comboInfoPublic({ comboId: detail.id, pubType: value }).then(res => {
                    Toast.clear()
                    if (res === 'sucess') {
                        Toast.show({
                            icon: "success",
                            content: toastText,

                        })
                        setDetail({ ...detail, isPub: value })
                        let data = JSON.parse(localStorage.getItem('composeItemDetail'))
                        data.isPub = value
                        localStorage.setItem("composeItemDetail", JSON.stringify(data))
                    }

                })

            }
        })
    }

    const onDelete = () => {
        Dialog.confirm({
            content: "确定要删除吗？",
            onConfirm: () => {
                const id = detail.id
                Toast.show({
                    icon: "loading",
                    content: "加载中...",
                    duration: 0,
                    maskClickable: false
                })
                comboInfoSubscribeDelete({ comboId: id }).then(res => {
                    Toast.clear()
                    if (res === 'sucess') {
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
                    Toast.clear()
                    console.log(err)
                    Toast.show({
                        icon: "fail",
                        content: err,
                    })
                })
            }
        })
    }

    return (
        <div className="compose-detail-wrapper">
            <div className="strategy-content">
                <div className="strategy-type">
                    <span>组合名称</span>
                    <span>{detail.comboName}</span>
                </div>
                <div className="strategy-type">
                    <span>收益率</span>
                    <span>{detail.totalYieldRate}%</span>
                </div>
                <div className="strategy-type">
                    <span>净值</span>
                    <span>{detail.netValue}</span>
                </div>
                <div className="strategy-type">
                    <span>开始时间</span>
                    <span>{detail.gmtCreate}</span>
                </div>

                {/* <div className="strategy-type">
                    <span>运行状态</span>
                    <Switch
                        checked={detail.comboStatus === 1}
                        onChange={changeStatus}
                        style={{

                            '--height': '20px',
                            '--width': '40px',
                        }}
                    />
                </div> */}
                {/* <div className="strategy-type-method">
                    <span>交易方式</span>
                    <div className="method-value">
                        <Radio.Group value={detail.isOrder} onChange={changeIsOrder}>
                            <Radio style={{ '--font-size': '14px', marginRight: 30 }} value={0}>仅提示交易信号</Radio>
                            <Radio style={{ '--font-size': '14px' }} value={1}>跟随下单</Radio>
                        </Radio.Group>
                    </div>
                </div> */}
                <div className="strategy-type-method">
                    <span>通知方式</span>
                    <div className="method-value" >
                        <span>系统通知</span>
                        <Switch
                            checked={detail.isSystemNotice === '1'}
                            onChange={checked => {
                                onChangeNotice('system', checked)
                            }}
                            style={{
                                '--height': '20px',
                                '--width': '40px',
                            }}
                        />
                    </div>
                    <div className="method-value">
                        <span>微信通知</span>
                        <Switch
                            checked={detail.isWeixinNotice === '1'}
                            onChange={async (checked) => {
                                if (checked) {
                                    const hasSub = await isSubGZH(navigate)
                                    if (!hasSub) {
                                        return
                                    }
                                }
                                onChangeNotice('weixin', checked)
                            }}
                            style={{
                                '--height': '20px',
                                '--width': '40px',
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="my-strategy-detail-btn-wrapper">
                <div onClick={() => {
                    navigate('/combination/' + params.id)
                }}>组合报告</div>
                {/* <div onClick={() => {
                    props.changeFirstEditStatus(true)
                    navigate('/composeEdit/' + params.id)

                }}>编辑组合</div> */}
                {/* {detail.isPub === 0 ? <div onClick={() => { onPublic(1) }}>公开组合</div> :

                    <div onClick={() => { onPublic(0) }} style={{ background: "#BBBBBB" }}>取消公开</div>} */}



                <div style={{ background: "rgb(250, 109, 65)" }} onClick={onDelete}>删除组合</div>
            </div>

        </div>
    )
}



const mapDispatchToProps = (dispatch) => {
    return {

        changeFirstEditStatus: (data) => {
            dispatch(changeFirstEditStatus(data))
        },

    }
}
export default connect(null, mapDispatchToProps)(ComposeItemDetail)

