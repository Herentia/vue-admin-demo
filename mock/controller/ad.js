const data = [
  {
    title: '这个一个滚动消息！！！',
    url: 'https://www.baidu.com',
  },
  {
    title: '这个第二个个滚动消息！！！',
    url: 'https://www.baidu.com',
  },
]
module.exports = [
  {
    url: '/ad/getList',
    type: 'get',
    response() {
      return {
        code: 200,
        msg: 'success',
        data,
      }
    },
  },
]
