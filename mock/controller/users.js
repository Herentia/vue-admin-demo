const content = []
const pageSize = 20
const pageNum = 1
for (let i = 0; i < pageSize; i++) {
  let obj = {}
  let index = (pageNum - 1) * pageSize + i + 1
  obj.id = index
  obj.name = 'kitty' + index
  obj.password =
    '9ec9750e709431dad22365cabc5c625482e574c74adaebba7dd02f1129e4ce1d'
  obj.salt = 'YzcmCZNvbXocrsz9dm8e'
  obj.email = 'kitty' + index + '@qq.com'
  obj.mobile = '18688982323'
  obj.status = 1
  obj.deptId = 12
  obj.deptName = '技术部'
  obj.status = 1
  if (i % 2 === 0) {
    obj.deptId = 13
    obj.deptName = '市场部'
  }
  obj.createBy = 'admin'
  obj.createTime = '2018-08-14 11:11:11'
  obj.createBy = 'admin'
  obj.createTime = '2018-09-14 12:12:12'
  obj.userRoles = [1]
  content.push(obj)
}
const findPageData = {
  code: 200,
  msg: 'success',
  data: {},
}
findPageData.data.pageNum = pageNum
findPageData.data.pageSize = pageSize
findPageData.data.totalSize = 20
module.exports = [
  // 查询全部用户信息
  {
    url: '/users/getUsersList',
    type: 'get',
    response() {
      return {
        code: 200,
        msg: 'success',
        content,
      }
    },
  },
  // 查询用户分页信息
  {
    url: '/users/findPage',
    type: 'post',
    response(config) {
      const { columnFilters = {}, pageNum = 1, pageSize = 5 } = config.body
      let pageList = {}
      if (
        Object.keys(columnFilters).length > 0 &&
        columnFilters.name.value != ''
      ) {
        let filterContent = content.filter((_item) =>
          _item.name.includes(columnFilters.name.value)
        )
        pageList = filterContent.filter(
          (_item, index) =>
            index < pageSize * pageNum && index >= pageSize * (pageNum - 1)
        )
      } else {
        pageList = content.filter(
          (_item, index) =>
            index < pageSize * pageNum && index >= pageSize * (pageNum - 1)
        )
      }
      findPageData.data.content = pageList
      return findPageData
    },
  },
]
