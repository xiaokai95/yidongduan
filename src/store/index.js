import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      auth.setUser(user)
    },
    // 清除用户信息
    delUser (state) {
      state.user = {}
      auth.delUser()
    }

  },
  actions: {

  },
  modules: {
  }
})
