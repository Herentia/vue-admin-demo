<template>
  <div class="page-container">
    <!--工具栏-->
    <div
      class="toolbar"
      style="float: left; padding-top: 10px; padding-left: 15px"
    >
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="iconfont kt-icon-sousuo"
            :label="'查询'"
            perms="sys:role:view"
            type="primary"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="iconfont kt-icon-jiahao"
            :label="'新增'"
            perms="sys:user:add"
            type="primary"
          />
        </el-form-item>
      </el-form>
    </div>

    <!--表格内容栏-->
    <kt-table
      :height="350"
      perms-edit="sys:user:edit"
      perms-delete="sys:user:delete"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
    ></kt-table>
  </div>
</template>

<script>
  import KtButton from '@/views/core/KtButton'
  import KtTable from '@/views/core/KtTable'
  import { getUsersList } from '@/api/users'
  export default {
    components: {
      KtButton,
      KtTable,
    },
    data() {
      return {
        size: 'small',
        filters: {
          name: '',
        },
        columns: [],
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        },
        // 新增编辑界面数据
        dataForm: {
          id: 0,
          name: '',
          password: '123456',
          deptId: 1,
          deptName: '',
          email: 'test@qq.com',
          mobile: '13889700023',
          status: 1,
          userRoles: [],
        },
        deptData: [],
        deptTreeProps: {
          label: 'name',
          children: 'children',
        },
        roles: [],
      }
    },
    mounted() {
      this.initColumns()
    },
    methods: {
      //获取分页数据
      async findPage() {
        this.pageResult = await getUsersList()
      },
      // 处理表格列过滤显示
      initColumns() {
        this.columns = [
          { prop: 'id', label: 'ID', minWidth: 50 },
          { prop: 'name', label: '用户名', minWidth: 120 },
          { prop: 'deptName', label: '机构', minWidth: 120 },
          { prop: 'roleNames', label: '角色', minWidth: 100 },
          { prop: 'email', label: '邮箱', minWidth: 120 },
          { prop: 'mobile', label: '手机', minWidth: 100 },
          { prop: 'status', label: '状态', minWidth: 70 },
        ]
        this.filterColumns = JSON.parse(JSON.stringify(this.columns))
      },
    },
  }
</script>

<style lang="scss" scoped></style>
