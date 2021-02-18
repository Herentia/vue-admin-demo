import request from '@/utils/request'

export function findAll(data) {
  return request({
    url: '/role/findAll',
    method: 'get',
    data,
  })
}

export function findPage(data) {
  return request({
    url: '/role/findPage',
    method: 'post',
    data,
  })
}
