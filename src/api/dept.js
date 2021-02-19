import request from '@/utils/request'

// 获取用户信息
export function findDeptTree(data) {
  return request({
    url: '/dept/findTree',
    method: 'get',
    data,
  })
}
