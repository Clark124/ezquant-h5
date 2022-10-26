import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Checkbox, Dialog, Toast } from 'antd-mobile-v5'
import './index.scss'
import { getPoolList, getPoolCodeList, deleteItemFromPool, createContractPool ,deleteContractPool} from '../../../../service/index'

let poolName = ""

export default function SymbolPoolManage() {
    const params = useParams()
    const navigate = useNavigate()
    const [selectList, setSelectList] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [dataList, setDataList] = useState([])
    const [idList, setIdList] = useState([])

    const [poolList, setPoolList] = useState([])
    const [seLectPool, setSeLectPool] = useState([])
    const [poolIdList, setPoolIdList] = useState([])

    // const [poolName, setPoolName] = useState("")
    const [visible, setVisible] = useState("")

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
                            onGetPoolList()

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

    useEffect(() => {
        getCodeList(params.id)
        onGetPoolList()
    }, [])

    //根据Id获取股票池列表
    const getCodeList = (id) => {
        const data = {
            pageSize: 1000,
            pageNum: 1,
            refId: id
        }
        getPoolCodeList(data).then(res => {
            const stkList = res.data.list.filter(item => item.type === 'stk')
            const futList = res.data.list.filter(item => item.type === 'fut')
            const ids = stkList.map(item => item.id)
            setDataList(stkList)
            setIdList(ids)
        })
    }

    //股票池
    const onGetPoolList = () => {
        getPoolList({ pageSize: 100, pageNum: 1 }).then(res => {
            let stkPoolList = res.data.list.filter(item => item.type === 'stk')
            let futPoolList = res.data.list.filter(item => item.type === 'fut')
            const ids = stkPoolList.map(item => item.id)
            setPoolList(stkPoolList)
            setPoolIdList(ids)
        })
    }

    const deleteSymbol = () => {
        console.log(selectList)
        if (selectList.length === 0) {
            Toast.show({
                content: '请选择股票',
            })
            return
        }
        Dialog.confirm({
            content: `确定要删除所选股票吗`,
            onConfirm: () => {
                deleteItemFromPool({ id: selectList.join(',') }).then(res => {
                    getCodeList(params.id)
                    setSelectList([])
                    Toast.show({
                        icon: 'success',
                        content: '删除成功',
                    })
                })
            }
        })

    }
    //删除股票池
    const deletePool = ()=>{
        console.log(seLectPool)
        if(seLectPool.length===0){
            Toast.show({
                content: '请选择股票池',
            })
            return
        }
        Dialog.confirm({
            content: `确定要删除所选股票池吗`,
            onConfirm: () => {
                deleteContractPool({ id: seLectPool.join(',') }).then(res => {
                    onGetPoolList()
                    setSeLectPool([])
                    Toast.show({
                        icon: 'success',
                        content: '删除成功',
                    })
                })
            }
        })
    }

    return (
        <div className="symbol-pool-manage-wrapper">
            <div className="tab-list">
                <div className={tabIndex === 0 ? "active" : ""} onClick={() => setTabIndex(0)}>管理股票</div>
                <div className={tabIndex === 1 ? "active" : ""} onClick={() => setTabIndex(1)}>管理股票池</div>
            </div>

            {tabIndex === 0 ?
                <div className="content">
                    <div className="data-list-wrapper">
                        <div className="head-title">
                            <span className="select-icon"></span>
                            <span className="code">代码</span>
                            <span className="code-name">股票</span>
                            {/* <span className="top-icon">置顶</span> */}
                        </div>
                        <Checkbox.Group
                            value={selectList}
                            onChange={val => {
                                setSelectList(val)
                            }}
                        >
                            {dataList.map((item, index) => {
                                return (
                                    <div className="symbol-item" key={item.id}>
                                        <Checkbox value={item.id} className="select-icon">
                                        </Checkbox>
                                        <span className="code">{item.symbol}</span>
                                        <span className="code-name">{item.name}</span>

                                    </div>
                                )
                            })}


                        </Checkbox.Group>

                        <div className="nav-add-code" onClick={() => navigate('/trade/addSymbolToPool/' + params.id)}>+添加股票</div>
                    </div>
                </div> : null
            }

            {tabIndex === 1 ?
                <div className="content">
                    <div className="data-list-wrapper">
                        <div className="head-title">
                            <span className="select-icon">选择</span>
                            <span className="code">股票池</span>


                        </div>
                        <Checkbox.Group
                            value={seLectPool}
                            onChange={val => {
                                setSeLectPool(val)
                            }}
                        >
                            {poolList.map((item, index) => {
                                return (
                                    <div className="symbol-item" key={index}>
                                        <Checkbox value={item.id} className="select-icon">
                                        </Checkbox>

                                        <span className="code-name">{item.name}</span>

                                    </div>
                                )
                            })}
                        </Checkbox.Group>

                        <div className="nav-add-code" onClick={() => showAddPoolModal()}>+新建股票池</div>
                    </div>
                </div> : null
            }


            {tabIndex === 0 ?
                <div className="footer">
                    <div className="select-all">
                        <Checkbox checked={idList.length === selectList.length} onChange={(e) => {
                            if (e) {
                                setSelectList(idList)
                            } else {
                                setSelectList([])
                            }


                        }}>全选</Checkbox>
                    </div>
                    <div style={{ background: "#083AEF", color: "#fff", width: 95 }} onClick={() => navigate('/trade/copyToPool/'+params.id)}>导入股票池</div>
                    <div style={{ background: "#FE5958", color: "#fff", width: 95 }} onClick={deleteSymbol}>删除</div>
                </div> :
                <div className="footer">
                    <div className="select-all">
                        <Checkbox checked={poolIdList.length === seLectPool.length} onChange={(e) => {
                            if (e) {
                                setSeLectPool(poolIdList)
                            } else {
                                setSeLectPool([])
                            }
                        }}>全选</Checkbox>
                    </div>

                    <div style={{ background: "#FE5958", color: "#fff", width: 95 }} onClick={deletePool}>删除</div>
                </div>
            }

        </div>
    )
}