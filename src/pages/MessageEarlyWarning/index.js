import React from 'react'
// import { Link } from 'react-router-dom'
import './index.scss'

export default function MessageEarlyWarning(){
    return (
        <div className="early-warning-wrapper">
            <div className="early-warning-item">
                <div className="date">2020-01-21</div>
                <div className="early-warning-info">
                    <div className="early-warning-name">
                        <span>市场预警通知</span>
                        <span className="btn">下单</span>
                    </div>
                    <div className="content">
                        您设置的预警 “穿越极限”，恒生电子(600570)现价突破12.35，设置买入1200股。
                    </div>
                </div>
            </div>
            <div className="early-warning-item">
                <div className="date">2020-01-21</div>
                <div className="early-warning-info">
                    <div className="early-warning-name">
                        <span>市场预警下单通知</span>
                        <span className="btn">下单</span>
                    </div>
                    <div className="content">
                        您设置的预警 “穿越极限”，恒生电子(600570)现价突破12.35，设置买入1200股。
                    </div>
                </div>
            </div>
        </div>
    )
}