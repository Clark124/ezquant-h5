
import { useEffect } from "react"
import { Toast } from "antd-mobile-v5";
import { useNavigate } from "react-router-dom";
import { getToken } from '../../service/index'

export default function LoginCallback() {
    let navigate = useNavigate()


    useEffect(() => {
        const href = window.location.href
        if (href.includes("?")) {
            const code = href.split("?")[1].split("&")[0].split("=")[1];
            if(!code){
                return
            }
            Toast.show({
                icon: "loading",
                content: "加载中...",
                duration: 0
            })
            getToken({ code, type: 0 }).then(res => {
                Toast.clear()
                if (res.retCode !== 0) {
                    window.location.replace('/')
                    Toast.show({
                        icon: "success",
                        content: "服务端出错",
                    })
                    return;
                } else {
                    if (res.data.id) {
                        Toast.show({
                            icon: "success",
                            content: "登录成功",
                        })
                        localStorage.setItem("userInfo", JSON.stringify(res.data));
                    }
                    window.location.replace('/')
                }

            }).catch(err => {
                Toast.clear()
                window.location.replace('/')
                Toast.show({
                    icon: "loading",
                    content: "网络出错",
                })

            });
            return
        }
    }, [])


    return (
        <div>

        </div>
    )
}