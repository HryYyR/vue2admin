<template>
  <div class="login-container">
    <div class="login-box">
      <!-- logo -->
      <div class="avater-box">
        <img src="../assets/logo.png" class="avater-box-img" />
      </div>

      <!-- 登录表单 ---------------start---------------->
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="loginformrules"
        ref="loginFormRef"
      >
        <!-- 登录 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>

        <!-- 注册 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 登录和重置 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
            v-loading.fullscreen.lock="fullscreenLoading"
            >登录</el-button
          >
          <el-button type="info" @click="resetloginform">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 登陆表单 ------------end---------------->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 账号密码
      loginForm: {
        username: "admin",
        password: "123456",
      },

      // 账号密码表单验证
      loginformrules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
      // 控制延时加载动画
      fullscreenLoading: false,
    };
  },

  methods: {
    // 重置
    resetloginform() {
      this.$refs.loginFormRef.resetFields();
    },

    // 登录检测
    login() {
      // 延时加载动画
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
      this.fullscreenLoading = true;
      setTimeout(() => {
        // 延时动画加载结束后进行请求
        this.$refs.loginFormRef.validate(async (valid) => {
          if (!valid) return; // 检测是否符合正则表达式，不符合就无作为

          const { data: res } = await this.$http.post("login", this.loginForm); // 判断输入数据是否正确，返回正确或者失败
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message.success("登陆成功！");
          window.sessionStorage.setItem("token", res.data.token); // 登录成功时把token保存到sessionStorage用于判断

          this.$router.push("/home"); // 跳转到home界面
        });
      }, 2500);
    },
  },
};
</script>
<style Lang="less" scoped>
.login-container {
  background-color: #2e4e6e;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avater-box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  background-color: #eee;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avater-box-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
