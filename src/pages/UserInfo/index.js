import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { Dialog, Toast } from 'antd-mobile-v5'
import { uploadImg, uploadAvatar ,updateNickname,updateBrief} from '../../service/index'

export default function UserEdit() {
    const navigate = useNavigate()

    const [nickname, setNickname] = useState("")
    const [brief, setBrief] = useState("")
    const [portrait, setPortrait] = useState("")
    const [file, setFile] = useState(null)


    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const { nickname, portrait, brief } = userInfo
        setNickname(nickname)
        setBrief(brief)
        setPortrait(portrait)
    }, [])

    const changeFileInput = (e) => {
        const file = e.target.files && e.target.files[0];

        var reader = new FileReader();
        reader.onloadend = () => {
            setPortrait(reader.result)
            setFile(file)
        }

        reader.readAsDataURL(file)

    }

    const saveAvatar = () => {
        let formData = new FormData();
        formData.append('file', file);
        Toast.show({
            icon: "loading",
            content: '上传中…',
            duration: 0
        })
        uploadImg(formData).then(res => {
            if (res.retCode === 0) {
                const img = res.data[0]
                uploadAvatar({ portrait: img }).then(res => {
                    Toast.clear()
                    if (res.retCode === 0) {
                        Toast.show({
                            icon: "success",
                            content: "保存成功"
                        })
                        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
                        userInfo.portrait = img
                        localStorage.setItem("userInfo", JSON.stringify(userInfo))
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            Toast.clear()
            console.log(err)
        })
    }

    const saveNickname = () => {
        Toast.show({
            icon: "loading",
            content: '加载中…',
            duration: 0
        })
        updateNickname({ nickname }).then(res => {
            Toast.clear()
            if (res.retCode === 0) {

                let userInfo = JSON.parse(localStorage.getItem('userInfo'))
                userInfo.nickname = nickname
                localStorage.setItem('userInfo', JSON.stringify(userInfo))

                Toast.show({
                    icon: "success",
                    content: "保存成功"
                })
            } else {
                Toast.show({
                    icon: "fail",
                    content: "保存失败"
                })
            }
        })
    }

    const saveBrief = ()=>{
        Toast.show({
            icon: "loading",
            content: '加载中…',
            duration: 0,
            maskClickable:false
        })
        updateBrief({ brief }).then(res => {
            Toast.clear()
            if (res.retCode === 0) {
                let userInfo = JSON.parse(localStorage.getItem('userInfo'))
                userInfo.brief = brief
                localStorage.setItem('userInfo', JSON.stringify(userInfo))

                Toast.show({
                    icon: "success",
                    content: "保存成功"
                })
            } else {
                Toast.show({
                    icon: "fail",
                    content: "保存失败"
                })
            }
        })
    }



    return (
        <div className="user-edit-wrapper">
            <div className="avatar-wrapper">
                <span>头像</span>
                <div className="avatar-right">
                    <input type="file" className='avatar-input' onChange={changeFileInput} />
                    <img src={portrait ? portrait : require('../../asstes/images/default.jpeg')} alt="" className="avatar" />
                    <img src={require('../../asstes/images/grarrow.png')} alt="" className="arrow-icon" />
                </div>
            </div>
            <div className='save-btn' onClick={saveAvatar}>保存头像</div>
            <div className="nickname-wrapper">
                <span className="title">昵称</span>
                <input className="nickname" type='text' placeholder='请输入昵称' value={nickname} onChange={e => setNickname(e.target.value)} />
            </div>
            <div className='save-btn' onClick={saveNickname}>保存昵称</div>
            <div className="brief-wrapper">
                <div className="title">个人简介</div>
                <textarea className='brief' placeholder='请输入简介' value={brief} onChange={(e) => setBrief(e.target.value)}></textarea>
            </div>

            <div className='save-btn' onClick={saveBrief}>保存简介</div>

        </div>
    )
}