import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './index.scss'
import { accountList, deleteAccount } from '../../service/traderoom'
import { setAccountDefault } from '../../service/index'
import { Dialog, Toast } from 'antd-mobile-v5'

function UserAccount(props) {
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        getAccountList()
    }, [])

    //获取账户列表
    const getAccountList = () => {
        accountList().then(res => {
            let result = res.data
            const { marketType } = props
            if (marketType === 0) {
                result = result.filter(item => item.accountType === 0)
            } else {
                result = result.filter(item => item.accountType === 1)
            }

            setDataList(result)

        })
    }

    //删除账户
    const deleteAccount = (id) => {
        Dialog.confirm({

            content: "确定要删除该账户吗？",
            onConfirm: () => {
                deleteAccount({ id }).then(res => {
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: "success",
                            content: '删除成功'
                        })
                        getAccountList()
                    } else {
                        Toast.show({
                            icon: "fail",
                            content: res.message
                        })
                    }
                })
            }
        })

    }

    //设为默认
    const setDefault = (item) => {
        Dialog.confirm({
            content: "确定要将该账户设置为默认吗？",
            onConfirm: () => {
                let type
                if (item.type === 0) {
                    type = 2
                }
                if (item.type === 1) {
                    type = 3
                }
                const data = {
                    id: item.id,
                    type,
                    userId: item.userId
                }
                setAccountDefault(data).then(res => {
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: 'success',
                            content: "设置成功",
                            afterClose: () => {
                                getAccountList()
                            }

                        })
                    } else {
                        Toast.show({
                            icon: 'fail',
                            content: res.message,
                        })
                    }
                })
            }
        })
    }

    return (
        <div className="user-account-wrapper">
            <div className="title">股票账户</div>

            {dataList.map((item, index) => {
                return (
                    <div className="account-item" key={item.id}>
                        <div className="account-info">
                            <span className="text">账户类型</span>
                            <span className="info">{item.describe}</span>
                        </div>
                        <div className="account-info">
                            <span className="text">交易账户</span>
                            <span className="info">{item.tradeAccount}</span>
                        </div>
                        <div className="account-info">
                            <span className="text">证券公司</span>
                            <span className="info">{item.company ? item.company : '--'}</span>
                        </div>

                        {/* <div className='btn-wrapper'>
                            <span className="btn delete" onClick={()=>deleteAccount(item.id)}>删除</span>
                            
                        </div> */}

                        {item.type === 0 || item.type === 1 ?
                            <span className="btn edit" onClick={()=>setDefault(item)}>设为默认</span> : null}
                    </div>
                )
            })}


        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        marketType: state.traderoom.marketType,
    };
}



export default connect(mapStateToProps, null)(UserAccount)