<template>
  <div class="page-container">
    <!--工具栏-->
    <div
      class="toolbar"
      style="float: left; padding-top: 10px; padding-left: 15px"
    >
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="iconfont kt-icon-sousuo"
            :label="'查询'"
            perms="sys:role:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="iconfont kt-icon-jiahao"
            :label="'新增'"
            perms=""
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <!-- <kt-table
      :height="220"
      perms-edit="sys:role:edit"
      perms-delete="sys:role:delete"
      :highlight-current-row="true"
      :stripe="false"
      :data="pageResult"
      :columns="columns"
      :show-batch-delete="true"
      @handleCurrentChange="handleRoleSelectChange"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></kt-table> -->
    <!--新增编辑界面-->
    <el-dialog
      :title="operation ? '新增' : '编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        :size="size"
      >
        <el-form-item v-if="false" label="ID" prop="id">
          <el-input
            v-model="dataForm.id"
            :disabled="true"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注 " prop="remark">
          <el-input
            v-model="dataForm.remark"
            auto-complete="off"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">
          {{ '关闭' }}
        </el-button>
        <el-button
          :size="size"
          type="primary"
          :loading="editLoading"
          @click.native="submitForm"
        >
          {{ '提交' }}
        </el-button>
      </div>
    </el-dialog>
    <!--角色菜单，表格树内容栏-->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span><B>角色菜单授权</B></span>
      </div>
      <el-tree
        ref="menuTree"
        v-loading="menuLoading"
        :data="menuData"
        size="mini"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        style="width: 100%; pading-top: 20px"
        :render-content="renderContent"
        element-loading-text="拼命加载中"
        :check-strictly="true"
        @check-change="handleMenuCheckChange"
      ></el-tree>
      <div
        style="
          float: left;
          padding-top: 12px;
          padding-bottom: 4px;
          padding-left: 24px;
        "
      >
        <el-checkbox
          v-model="checkAll"
          :disabled="selectRole.id == null"
          @change="handleCheckAll"
        >
          <b>全选</b>
        </el-checkbox>
      </div>
      <div
        style="
          float: right;
          padding-top: 4px;
          padding-right: 15px;
          padding-bottom: 4px;
        "
      >
        <kt-button
          :label="'重置'"
          perms="sys:role:edit"
          type="primary"
          :disabled="selectRole.id == null"
          @click="resetSelection"
        />
        <kt-button
          :label="'提交'"
          perms="sys:role:edit"
          type="primary"
          :disabled="selectRole.id == null"
          :loading="authLoading"
          @click="submitAuthForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import KtButton from '@/views/core/KtButton'
  import KtTable from '@/views/core/KtTable'
  import { findPage } from '@/api/role'
  import { findMenuTree } from '@/api/menu'
  import { format } from '@/utils/datetime'
  export default {
    components: {
      KtButton,
      // KtTable,
    },
    data() {
      return {
        size: 'small',
        filters: {
          name: '',
        },
        columns: [
          { prop: 'id', label: 'ID', minWidth: 50 },
          { prop: 'name', label: '角色名', minWidth: 120 },
          { prop: 'remark', label: '备注', minWidth: 120 },
          { prop: 'createBy', label: '创建人', minWidth: 120 },
          {
            prop: 'createTime',
            label: '创建时间',
            minWidth: 120,
            formatter: this.dateFormat,
          },
        ],
        pageRequest: { pageNum: 1, pageSize: 5 },
        pageResult: {},

        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        },
        // 新增编辑界面数据
        dataForm: {
          id: 0,
          name: '',
          remark: '',
        },
        selectRole: {},
        menuData: [],
        menuSelections: [],
        menuLoading: false,
        authLoading: false,
        checkAll: false,
        currentRoleMenus: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      }
    },
    mounted() {},
    methods: {
      // 获取分页数据
      async findPage(data) {
        if (data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.columnFilters = {
          name: { name: 'name', value: this.filters.name },
        }
        let res = await findPage(this.pageRequest)
        this.pageResult = res.data
        this.findTreeData()
      },
      // 批量删除
      handleDelete: function (data) {
        this.$api.role.batchDelete(data.params).then(data.callback)
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true
        this.operation = true
        this.dataForm = {
          id: 0,
          name: '',
          remark: '',
        }
      },
      // 显示编辑界面
      handleEdit: function (params) {
        console.log(params)
        this.dialogVisible = true
        this.operation = false
        this.dataForm = Object.assign({}, params.row)
      },
      // 编辑
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              this.$api.role.save(params).then((res) => {
                this.editLoading = false
                if (res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                } else {
                  this.$message({
                    message: '操作失败, ' + res.msg,
                    type: 'error',
                  })
                }
                this.findPage(null)
              })
            })
          }
        })
      },
      // 获取菜单数据
      async findTreeData() {
        this.menuLoading = true
        let res = await findMenuTree()
        this.menuData = res.data
        this.menuLoading = false
      },
      // 角色选择改变监听
      handleRoleSelectChange(val) {
        console.log(val)
        if (val == null || val.val == null) {
          return
        }
        this.selectRole = val.val
        this.$api.role.findRoleMenus({ roleId: val.val.id }).then((res) => {
          this.currentRoleMenus = res.data
          this.$refs.menuTree.setCheckedNodes(res.data)
        })
      },
      // 树节点选择监听
      handleMenuCheckChange(data, check, subCheck) {
        if (check) {
          // 节点选中时同步选中父节点
          let parentId = data.parentId
          this.$refs.menuTree.setChecked(parentId, true, false)
        } else {
          // 节点取消选中时同步取消选中子节点
          if (data.children != null) {
            data.children.forEach((element) => {
              this.$refs.menuTree.setChecked(element.id, false, false)
            })
          }
        }
      },
      // 重置选择
      resetSelection() {
        this.checkAll = false
        this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus)
      },
      // 全选操作
      handleCheckAll() {
        if (this.checkAll) {
          let allMenus = []
          this.checkAllMenu(this.menuData, allMenus)
          this.$refs.menuTree.setCheckedNodes(allMenus)
        } else {
          this.$refs.menuTree.setCheckedNodes([])
        }
      },
      // 递归全选
      checkAllMenu(menuData, allMenus) {
        menuData.forEach((menu) => {
          allMenus.push(menu)
          if (menu.children) {
            this.checkAllMenu(menu.children, allMenus)
          }
        })
      },
      // 角色菜单授权提交
      submitAuthForm() {
        let roleId = this.selectRole.id
        if ('admin' == this.selectRole.name) {
          this.$message({
            message: '超级管理员拥有所有菜单权限，不允许修改！',
            type: 'error',
          })
          return
        }
        this.authLoading = true
        let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
        let roleMenus = []
        for (let i = 0, len = checkedNodes.length; i < len; i++) {
          let roleMenu = { roleId: roleId, menuId: checkedNodes[i].id }
          roleMenus.push(roleMenu)
        }
        this.$api.role.saveRoleMenus(roleMenus).then((res) => {
          if (res.code == 200) {
            this.$message({ message: '操作成功', type: 'success' })
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
          this.authLoading = false
        })
      },
      renderContent(h, { node, data, store }) {
        return (
          <div class="column-container">
            <span style="text-algin:center;margin-right:80px;">
              {data.name}
            </span>
            <span style="text-algin:center;margin-right:80px;">
              <el-tag
                type={
                  data.type === 0 ? '' : data.type === 1 ? 'success' : 'info'
                }
                size="small"
              >
                {data.type === 0 ? '目录' : data.type === 1 ? '菜单' : '按钮'}
              </el-tag>
            </span>
            <span style="text-algin:center;margin-right:80px;">
              {' '}
              <i class={data.icon}></i>
            </span>
            <span style="text-algin:center;margin-right:80px;">
              {data.parentName ? data.parentName : '顶级菜单'}
            </span>
            <span style="text-algin:center;margin-right:80px;">
              {data.url ? data.url : '\t'}
            </span>
          </div>
        )
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index) {
        return format(row[column.property])
      },
    },
  }
</script>

<style lang="scss" scoped>
  .menu-container {
    margin-top: 30px;
  }
  .menu-header {
    padding-bottom: 5px;
    padding-left: 8px;
    font-size: 16px;
    color: rgb(20, 89, 121);
    text-align: left;
  }
</style>
