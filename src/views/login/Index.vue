<template>
  <div class="page-login">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登 录"></van-nav-bar>
    <van-cell-group>
      <van-field
        @blur="checkMobile"
        :error-message="errMsg.mobile"
        v-model="loginForm.mobile"
        label="手机号"
        placeholder="请输入手机号"
      />
      <van-field
        @blur="checkCode"
        :error-message="errMsg.code"
        v-model="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" @click="loginSubmit" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      const value = this.loginForm.mobile
      if (!value) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(value)) {
        this.errMsg.mobile = '格式不正确'
        return false
      }
      this.errMsg.mobile = ''
    },
    checkCode () {
      const value = this.loginForm.code
      if (!value) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(value)) {
        this.errMsg.code = '请输入六位验证码'
        return false
      }
      this.errMsg.code = ''
    },
    async loginSubmit () {
      this.checkMobile()
      this.checkCode()
      if (this.errMsg.mobile || this.errMsg.code) {
        return false
      }
      try {
        const data = await login(this.loginForm)
        this.setUser(data)
        this.$router.push(this.$route.query.redirectUrl || '/user')
      } catch (e) {
        this.$toast.fail('手机号或验证码错误')
      }
    },
    ...mapMutations(['setUser'])
  }
}
</script>

<style scoped lang='less'>
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
