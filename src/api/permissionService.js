import request from '@/utils/request'

export function getDicList (parameter) {
  return request({
    url: '/admin/dict/list',
    method: 'post',
    data: parameter
  })
}

export function getDicInfo (id) {
  return request({
    url: '/admin/dict/get',
    method: 'post',
    data: {id}
  })
}

export function saveDicInfo (data) {
  return request({
    url: '/admin/dict/save',
    method: 'post',
    data
  })
}


export function phoneDel (data) {
  return request({
    url: '/admin/dict/phone/del',
    method: 'post',
    data: data
  })
}

/**
* @Description: id phone location  uid
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/16 23:04
*/

export function phoneSave (data) {
  return request({
    url: '/admin/dict/phone/save',
    method: 'post',
    data: data
  })
}

/**
 * @Description: id phone location  uid
 * @Param:
 * @return:
 * @Author: zzhihang@hotmail.com
 * @date: 2022/4/16 23:04
 */

export function sysUserList (data) {
  return request({
    url: '/sysuser',
    method: 'post',
    data: data
  })
}


export function sysRoleList (data) {
  return request({
    url: '/sysrole/query',
    method: 'post',
    data: data
  })
}

export function sysUserDisable (id) {
  return request({
    url: '/sysuser/disable',
    method: 'post',
    data: {id}
  })
}

export function sysUserEnable (id) {
  return request({
    url: '/sysuser/enable',
    method: 'post',
    data: {id}
  })
}

/**
* @Description:  参数
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/17 15:56
*/

export function sysUserSave (params) {
  return request({
    url: '/sysuser/save',
    method: 'post',
    data: params
  })
}

export function sysAllPermission (params) {
  return request({
    url: '/sysrole/allpermission',
    method: 'post',
    data: params
  })
}

export function sysUserPermission (params) {
  return request({
    url: '/sysrole/userpermission',
    method: 'post',
    data: params
  })
}

/**
* @Description: 这个返回角色和对应的权限
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/17 17:44
*/
export function sysRoleAndPermission (params) {
  return request({
    url: '/sysrole/list',
    method: 'post',
    data: params
  })
}

/**
* @Description: 这个返回角色和对应的权限
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/17 17:44
*/
export function sysRoleSave (params) {
  return request({
    url: '/sysrole/save',
    method: 'post',
    data: params
  })
}