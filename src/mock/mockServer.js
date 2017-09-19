/**
 * Created by shanshan on 2017/9/15.
 */
//使用mockjs提交模拟接口
import Mock from 'mockjs'
import apiData from './data.json'

//注册路由，不需要暴露接口
Mock.mock('/api2/seller',{code:0,data:apiData.seller})
Mock.mock('/api2/goods',{code:0,data:apiData.goods})
Mock.mock('/api2/ratings',{code:0,data:apiData.ratings})
