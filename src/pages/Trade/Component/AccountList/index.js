
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Radio, Dialog, Toast } from 'antd-mobile-v5'
import { setCurrentAccountId } from '../../actions'
import './index.scss'
import { setAccountDefault } from '../../../../service/index'

function AccountList(props) {
    const navigate = useNavigate()

    //设为默认
    const setDefault = (item) => {
        if(item.type===2||item.type===3){
            navigate(-1)
            return
        }
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
                                navigate(-1)
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

    const onConfirm = () => {
        let account = {}
        props.accountList.forEach(item => {
            if (item.tradeAccount === props.currentAccountId) {
                account = item
            }
        })
        setDefault(account)
    }

    return (
        <div className='account-list-wrapper'>
            <div className='title'>选择账户</div>
            <div className='account-list'>
                <Radio.Group onChange={(e) => {
                    props.setCurrentAccountId(e)

                }}
                    value={props.currentAccountId}
                >
                    {props.accountList.map((item, index) => {
                        return (
                            <div className='account-item' key={item.tradeAccount}>
                                <div>
                                    <span>{item.describe} </span>
                                    <span>({item.tradeAccount})</span>
                                </div>

                                <Radio value={item.tradeAccount} />
                            </div>
                        )
                    })}
                </Radio.Group>

            </div>

            <div className='footer-btn' onClick={onConfirm}>确定</div>
        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        accountList: state.traderoom.accountList,
        currentAccountId: state.traderoom.currentAccountId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentAccountId: (data) => {
            dispatch(setCurrentAccountId(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountList)