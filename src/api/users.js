import request from '@/utils/request'

// 获取用户信息
export function getUsersList(data) {
  return request({
    url: '/users/getUsersList',
    method: 'get',
    data,
  })
}
// 获取用户分页信息
export function findPage(data) {
  return request({
    url: '/users/findPage',
    method: 'post',
    data,
  })
}
