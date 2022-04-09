import request from '@/utils/request'

export function getSysLogList (parameter) {
  return request({
    url: '/syslog',
    method: 'post',
    data: parameter
  })
}
