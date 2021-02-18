import request from '@/utils/request'

export function findMenuTree(data) {
  return request({
    url: '/menu/findMenuTree',
    method: 'get',
    data,
  })
}
