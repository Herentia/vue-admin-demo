const content = [
  {
    id: 1,
    createBy: 'admin',
    createTime: '2018-08-14T03:11:11.000+0000',
    lastUpdateBy: 'admin',
    lastUpdateTime: '2018-08-14T03:11:11.000+0000',
    name: 'admin',
    remark: '超级管理员',
    delFlag: 0,
  },
  {
    id: 2,
    createBy: 'admin',
    createTime: '2018-08-14T03:11:11.000+0000',
    lastUpdateBy: 'admin',
    lastUpdateTime: '2018-08-14T03:11:11.000+0000',
    name: 'dev',
    remark: '开发人员',
    delFlag: 0,
  },
  {
    id: 3,
    createBy: 'admin',
    createTime: '2018-08-14T03:11:11.000+0000',
    lastUpdateBy: 'admin',
    lastUpdateTime: '2018-08-14T03:11:11.000+0000',
    name: 'test',
    remark: '测试人员',
    delFlag: 0,
  },
  {
    id: 4,
    createBy: 'admin',
    createTime: '2018-08-14T03:11:11.000+0000',
    lastUpdateBy: 'admin',
    lastUpdateTime: '2018-08-14T03:11:11.000+0000',
    name: 'dev4',
    remark: '开发人员',
    delFlag: 0,
  },
  {
    id: 5,
    createBy: 'admin',
    createTime: '2018-08-14T03:11:11.000+0000',
    lastUpdateBy: 'admin',
    lastUpdateTime: '2018-08-14T03:11:11.000+0000',
    name: 'dev5',
    remark: '开发人员',
    delFlag: 0,
  },
  {
    id: 6,
    createBy: 'admin',
    createTime: '2018-08-14T03:11:11.000+0000',
    lastUpdateBy: 'admin',
    lastUpdateTime: '2018-08-14T03:11:11.000+0000',
    name: 'dev6',
    remark: '开发人员',
    delFlag: 0,
  },
  {
    id: 7,
    createBy: 'admin',
    createTime: '2018-08-14T03:11:11.000+0000',
    lastUpdateBy: 'admin',
    lastUpdateTime: '2018-08-14T03:11:11.000+0000',
    name: 'dev7',
    remark: '开发人员',
    delFlag: 0,
  },
  {
    id: 8,
    createBy: 'admin',
    createTime: '2018-08-14T03:11:11.000+0000',
    lastUpdateBy: 'admin',
    lastUpdateTime: '2018-08-14T03:11:11.000+0000',
    name: 'dev8',
    remark: '开发人员',
    delFlag: 0,
  },
]
const pageSize = 20
const pageNum = 1
const findPageData = {
  code: 200,
  msg: null,
  data: {},
}
findPageData.data.pageNum = pageNum
findPageData.data.pageSize = pageSize
findPageData.data.totalSize = 8
// findPageData.data.content = content
module.exports = [
  // 查询全部
  {
    url: '/role/findAll',
    type: 'get',
    response() {
      return {
        code: 200,
        msg: 'success',
        content,
      }
    },
  },
  // 分页查询
  {
    url: '/role/findPage',
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
