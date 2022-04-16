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