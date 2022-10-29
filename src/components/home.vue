<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/home.jpeg" class="homelogo" />
        <span class="homename">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout"> 退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <!-- 列表折叠功能 -->
        <div class="toggle-buttom" @click="togglecollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="iscollapse"
          :collapse-transition="false"
          :default-active="ACTIVEPATH"
          router
          unique-opened
        >
          <!-- 列表 -->
          <el-submenu
            :index="item.id + ' '"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 图标及一级标题 -->
            <template slot="title">
              <i :class="iconsobj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->

            <el-menu-item
              :index="'/' + subitem.path + ''"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="savenavstate('/' + subitem.path)"
            >
              <!-- 二级图标及二级标题 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- 路由占位符  -----welcome -->
        <router-view> </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据   res.data赋予
      menulist: [],

      // 列表图标数据
      iconsobj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },

      iscollapse: false, //切换侧边栏宽度
      ACTIVEPATH: "", //被激活的链接的地址
    };
  },

// 进入网页时调用
  created() {
    this.getmenulist();
    this.ACTIVEPATH = window.sessionStorage.getItem("activePath");
  },

  methods: {
    // 点击退出触发，清除token，返回到登陆界面
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    async getmenulist() {
      // 获取所有的菜单
      const { data: res } = await this.$http.get("menus"); //调用api menus接口 获取列表数据
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg); //判断获取是否成功，如果失败返回msg里默认的失败返回
      this.menulist = res.data; //否则将数据赋予menulist
    },
    // 点击实现侧边栏折叠和展开
    togglecollapse() {
      this.iscollapse = !this.iscollapse;
    },
    //解决点击二级菜单高亮显示问题
    savenavstate(activepath) {
      window.sessionStorage.setItem("activePath", activepath); //通过subitem.path获取path值赋予token
      this.ACTIVEPATH = activepath  //将token赋予变量ACTIVEPATH，通过ACTIVEPATH判断:default-active的值
    },
  },
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    margin-left: 5px;
    > span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.homelogo {
  margin-top: 2.5px;
  width: 4.8%;
  border-radius: 50%;
}

.homename {
  font-size: 1.5rem;
  color: #eaedf1;
}

.el-menu {
  border: 0;
}
.toggle-buttom {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

  