import request from '@/utils/request'

export function getBloggerList (parameter) {
  return request({
    url: '/admin/user/tz',
    method: 'post',
    data: parameter
  })
}

/**
* @Description: 普通用户
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/10 14:17
*/
export function getMemberList(parameter){
  return request({
    url: '/admin/user/pt',
    method: 'post',
    data: parameter
  })
}

/**
* @Description: 禁用 参数 id
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/9 22:53
*/
export function userDisable (id) {
  return request({
    url: '/admin/user/tz/disable',
    method: 'post',
    data: {id}
  })
}
export function userEnable (id) {
  return request({
    url: '/admin/user/tz/enable',
    method: 'post',
    data: {id}
  })
}

/**
* @Description: 创建用户
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/9 23:48
*/
export function userSave (data) {
  return request({
    url: '/admin/user/tz/save',
    method: 'post',
    data: data
  })
}

/**
* @Description: 修改模板id
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/9 23:48
*/
export function updateWxTemplate (data) {
  return request({
    url: '/admin/user/tz/updateWxTemplate',
    method: 'post',
    data: data
  })
}

/**
* @Description: 保存服务费
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/10 0:47
*/

export function userSaveServiceRate (data) {
  return request({
    url: '/admin/user/tz/updateServiceRate',
    method: 'post',
    data: data
  })
}

/**
* @Description: 查询用户信息
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/10 0:11
*/
export function userQuery (id) {
  return request({
    url: '/admin/user/tz/info',
    method: 'post',
    data: {id}
  })
}

/**
* @Description: 会员信息查询
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/10 14:44
*/

export function getMemberInfo (params) {
  return request({
    url: '/admin/user/pt/info',
    method: 'post',
    data: params
  })
}

/**
* @Description: 导出短信
* @Param: type  type直接传 糖主管理  会员管理 订单管理
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/23 16:59
*/
export function sysSmsSend (type) {
  return request({
    url: '/admin/syssms/send',
    method: 'post',
    data: {type}
  })
}

/**
* @Description: 传code校验验证码 然后 下载code也带上
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/23 16:59
*/
export function checkCode ({type, code}) {
  return request({
    url: '/admin/syssms/checkCode',
    method: 'post',
    data: {type, code}
  })
}