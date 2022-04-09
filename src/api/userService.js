import request from '@/utils/request'

export function getBloggerList (parameter) {
  return request({
    url: '/admin/user/tz',
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
* @Description: 保存服务费
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/10 0:47
*/

export function userSaveServiceRate (data) {
  return request({
    url: '/admin/user/tz/save',
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