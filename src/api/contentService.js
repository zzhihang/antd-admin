import request from '@/utils/request'

export function getContentList (parameter) {
  return request({
    url: '/admin/zhuanti/item',
    method: 'post',
    data: parameter
  })
}


export function getContentInfo (id) {
  return request({
    url: '/admin/zhuanti/item/info',
    method: 'post',
    data: {id}
  })
}
/**
* @Description: 参数:id  auditType 1 通过 2 驳回   audit 审核内容
* @Param:
* @return:
* @Author: zzhihang@hotmail.com
* @date: 2022/4/10 17:09
*/
export function auditContent (parameter) {
  return request({
    url: '/admin/zhuanti/item/audit',
    method: 'post',
    data: parameter
  })
}
