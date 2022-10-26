
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, Input, Toast } from 'antd-mobile-v5'
import './index.scss'
import { getPoolList, getPoolCodeList, deleteItemFromPool ,createContractPool} from '../../../../service/index'
import { favorList } from '../../../../service/traderoom'
import { connect } from 'react-redux'
import {onGetQuote,changeCode} from '../../actions'

let poolName = ""

function TradeSymbolPool(props) {
    const navigate = useNavigate()

    const [poolIndex, setPoolIndex] = useState(0)
    const [poolList, setPoolList] = useState([])
    const [dataList, setDataList] = useState([])
    const [poolId, setPoolId] = useState("")

    // const poolList = ['自选股', '短线超低', '长期持有', '热门精选']

    useEffect(() => {
        onGetPoolList()
        onGetFavorList()
    }, [])

    const showAddPoolModal = () => {
        poolName = ""
        Dialog.confirm(
            {
                title: "新建股票池",
                content: (
                    <div className="add-pool-input">
                        <input type="text" placeholder="不超过20个字符" onChange={(e) => poolName = e.target.value} />
                    </div>
                ),
                onConfirm: () => {
                    console.log(poolName)
                    if (poolName.trim() === "") {
                        Toast.show({
                            content: '请输入股票池名称',
                        })
                        return
                    }
                    if (poolName.length > 20) {
                        Toast.show({
                            content: '不能超过20个字符',
                        })
                        return
                    }
                    const data = {
                        type: 0,  //0 股票 1期货
                        name: poolName,
                        codes: ""
                    }
                    createContractPool(data).then(res => {
                        if (res.retCode === 0) {
                            Toast.show({
                                icon: 'success',
                                content: '创建成功',
                            })
                            onGetPoolList((value)=>{
                                onChangePool(value[0],1)
                            })
                        } else {
                            Toast.show({
                                content: res.message,
                            })
                        }

                    })
                }
            }
        )
    }

    const onGetPoolList = (callback) => {
        getPoolList({ pageSize: 100, pageNum: 1 }).then(res => {
            let stkPoolList = res.data.list.filter(item => item.type === 'stk')
            let futPoolList = res.data.list.filter(item => item.type === 'fut')

            setPoolList(stkPoolList)
            if(callback){
                callback(stkPoolList)
            }
        })
    }

    //自选列表  0 股票  1期货
    const onGetFavorList = (type) => {
        let userInfo = localStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)

        favorList({ pageNum: 1, pageSize: 1000, refId: userInfo.id }).then(res => {
            const stkList = res.data.list.filter(item => item.type === 'stk')
            const futList = res.data.list.filter(item => item.type === 'fut')
            setDataList(stkList)
            setPoolId(userInfo.id)
        })
    }

    //切换股票池
    const onChangePool = (item, index) => {
        setPoolIndex(index)
        getCodeList(item.id)
    }

    //根据Id获取股票池列表
    const getCodeList = (id, name) => {
        const data = {
            pageSize: 1000,
            pageNum: 1,
            refId: id
        }
        getPoolCodeList(data).then(res => {
            setDataList(res.data.list.filter(item=>item.symbol))
            setPoolId(id)
        })
    }

    //删除股票池里面的股票
    const deleteSymbol = (item) => {
        Dialog.confirm({
            title: "确定要从股票池里删除该股票吗？",
            onConfirm: () => {
                deleteItemFromPool({ id: item.id }).then(res => {

                    if (poolIndex === 0) {
                        onGetFavorList()
                    } else {
                        getCodeList(poolList[poolIndex - 1].id)
                    }

                    Toast.show({
                        icon: 'success',
                        content: "删除成功",
                    })
                })
            }
        })
    }

    const handleSelectStock = (item) => {
        cancelKlineWebsocket(props.stockCode)
        props.onGetQuote(item.symbol)
        props.changeCode(item.symbol)
        subKlineWebsocket(item.symbol)
        navigate(-1)
    }

    const subKlineWebsocket = (code) => {
        let userId = props.randomString
        let useInfo = localStorage.getItem('userInfo')
        if (useInfo) {
            userId = JSON.parse(useInfo).id
        }
        const sub = {
            userId: userId,
            module: 5,
            cmd: 2,
            periods: [props.period],
            subscribeProdCodes: code
        }
        window.newSocket.send(JSON.stringify(sub))
    }
    const cancelKlineWebsocket = (code) => {
        let userId = props.randomString
        let useInfo = localStorage.getItem('userInfo')
        if (useInfo) {
            userId = JSON.parse(useInfo).id
        }
        const sub = {
            userId: userId,
            module: 5,
            cmd: 3,
            periods: [props.period],
            subscribeProdCodes: code
        }
        window.newSocket.send(JSON.stringify(sub))
    }
    return (
        <div className="symbol-pool-wrapper">
            <div className="symbol-pool-list-wrapper">
                <div className="symbol-pool-list">
                    <div className="pool-list">
                        <div className={poolIndex === 0 ? 'active' : ''} onClick={() => {
                            setPoolIndex(0)
                            onGetFavorList()
                        }}>
                            自选
                        </div>
                        {poolList.map((item, index) => {
                            return (
                                <div key={index + 1} className={poolIndex === index + 1 ? 'active' : ''} onClick={() => { onChangePool(item, index + 1) }}>
                                    {item.name}
                                </div>
                            )
                        })}
                    </div>

                </div>
                <div className="add-pool-btn" onClick={() => showAddPoolModal()}>
                    ＋
                </div>
            </div>

            <div className="content">

                <div className="symbol-list">
                    <div className="head-title">
                        <span className="code">代码</span>
                        <span className="code-name">股票</span>
                        <span className="operate">操作</span>
                    </div>
                    {dataList.map((item, index) => {
                        return (
                            <div className="symbol-item" key={index}>
                                <span className="code" onClick={()=>handleSelectStock(item)}>{item.symbol}</span>
                                <span className="code-name">{item.name}</span>
                                <span className="delete" onClick={() => deleteSymbol(item)}>删除</span>
                            </div>
                        )
                    })}
                    {dataList.length === 0 ?
                        <div className="no-data">请添加股票</div> : null
                    }
                </div>


                <div className="footer-btn">
                    <div onClick={() => navigate('/trade/manageSymbolPool/' + poolId)}>管理</div>
                    <div onClick={() => navigate('/trade/addSymbolToPool/' + poolId)}>添加</div>
                </div>
            </div>



        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        stockCode: state.traderoom.code,
        period:state.traderoom.period,
        marketType: state.traderoom.marketType,
        randomString:state.traderoom.randomString
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetQuote: (code, uuid) => {
            dispatch(onGetQuote(code, uuid))
        },
        changeCode:(code)=>{
            dispatch(changeCode(code))
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeSymbolPool)