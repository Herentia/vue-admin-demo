import request from '@/utils/request'

export function getUsersList(data) {
  return request({
    url: '/users/getUsersList',
    method: 'get',
    data,
  })
}
