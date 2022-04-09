import request from '@/utils/request'

export function getContentList (parameter) {
  return request({
    url: '/admin/zhuanti/item',
    method: 'post',
    data: parameter
  })
}
