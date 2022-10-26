import { useState, useEffect } from 'react'
import { Checkbox, Dialog,Toast } from 'antd-mobile-v5'
import { useNavigate ,useParams} from 'react-router-dom'
import { getPoolList,importContractPool} from '../../../../service/index'
import './index.scss'


export default function CopyToPool() {
    const navigate = useNavigate()
    const params = useParams()
    const [selectList, setSelectList] = useState([])
    const [poolList, setPoolList] = useState([])

    useEffect(() => {
        onGetPoolList()
    }, [])

    //股票池
    const onGetPoolList = () => {
        getPoolList({ pageSize: 100, pageNum: 1 }).then(res => {
            let stkPoolList = res.data.list.filter(item => item.type === 'stk').filter(item=>item.id!==Number(params.id))
            let futPoolList = res.data.list.filter(item => item.type === 'fut').filter(item=>item.id!==Number(params.id))
            const ids = stkPoolList.map(item => item.id)
            setPoolList(stkPoolList)
        })
    }

    const showAddPoolModal = () => {
        Dialog.confirm(
            {
                title: "新建股票池",
                content: (
                    <div className="add-pool-input">
                        <input type="text" placeholder="不超过20个字符" />
                    </div>
                )
            }
        )
    }

    const onConfirm = ()=>{
        console.log(selectList)
        if(selectList.length===0){
            Toast.show({
                content: '请选择股票池',
            })
            return
        }
        Dialog.confirm({
            content: `确定导入吗`,
            onConfirm: () => {
                importContractPool({
                    refId: params.id,
                    id: selectList.join(',')
                }).then(res => {
                    navigate(-1)
                    Toast.show({
                        icon:"success",
                        content: '导入成功',
                    })
                })
            }
        })
    }

    return (
        <div className="copu-to-pool-wrapper">
            <div className="content">

                <Checkbox.Group
                    value={selectList}
                    onChange={val => {
                        setSelectList(val)
                    }}
                >
                    {poolList.map((item, index) => {
                        return (
                            <div className="pool-item" key={item.id}>
                                <Checkbox value={item.id} className="select-icon">
                                </Checkbox>
                                <span className="code">{item.name}</span>

                            </div>
                        )
                    })}


                </Checkbox.Group>

                {/* <div className="add-pool" onClick={() => showAddPoolModal()}>+新建股票池</div> */}
            </div>
            <div className="footer-btn">
                <div style={{ background: "#BBBBBB" }} onClick={() => navigate(-1)}>取消</div>
                <div onClick={onConfirm}>确定</div>
            </div>
        </div>
    )
}