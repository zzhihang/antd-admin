import request from '@/utils/request'

export function getOrderList (parameter) {
  return request({
    url: '/admin/order',
    method: 'post',
    data: parameter
  })
}
