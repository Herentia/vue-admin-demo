export default {
  state: {
    perms: [
      'sys:role:delete',
      'sys:role:edit',
      'sys:role:view',
      'sys:role:add',
    ], // 用户权限标识集合
  },
  getters: {},
  mutations: {
    setPerms(state, perms) {
      // 用户权限标识集合
      state.perms = perms
    },
  },
  actions: {},
}
