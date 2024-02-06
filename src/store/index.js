import { createStore } from 'vuex'

export default createStore({
  state: {
    userID:-1
  },
  getters: {
  },
  mutations: {
    updateUserId(state,newId){
      state.userID=newId

    }
  },
  actions: {
  },
  modules: {
  }
})
