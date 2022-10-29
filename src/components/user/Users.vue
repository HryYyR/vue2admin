<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 列表 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="qureyinfo.query"
            @clear="getuserlist"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuserlist"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表   :data调用数组 -->
      <el-table :data="userlist" border stripe style="width: auto">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="120"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱" width="320">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="220"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="职称"
          width="200"
        ></el-table-column>
        <el-table-column label="状态" width="220">
          <template v-slot:default="scope">
            <!-- v-slot:default="scope"用来提供 具名插槽 或 需要接收 prop 的插槽。 -->
            <!-- 开关组件 model控制开关 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userstatechange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="450px">
          <template v-slot:="scope">
            <!-- 修改 -->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <!-- tooltip是鼠标进入提示 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showeditdialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeuserbyid(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配 -->
            <el-tooltip
              effect="dark"
              content="分配"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setrole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="qureyinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="qureyinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogclosed"
    >
      <!-- 内容 -->
      <el-form
        :model="addform"
        :rules="addformrules"
        ref="addformref"
        label-width="70px"
      >
        <!-- 添加用户验证表单 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="adddialogclosed"
    >
      <el-form
        :model="editform"
        :rules="editformrules"
        ref="editformref"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituserinfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框start -->
    <el-dialog
      title="分配角色"
      :visible.sync="setroledialogVisible"
      width="50%"
      @close="setroledialogclosed"
    >
      <div>
        <p>当前的用户：{{ userinfo.username }}</p>
        <p>当前的角色：{{ userinfo.role_name }}</p>
        <p>
          分配新的角色：<el-select
            v-model="selectedroleid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setroledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveroleinfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框end -->
  </div>
</template>
      
<script>
export default {
  data() {
    // 验证邮箱规则
    var checkemail = (rule, value, cb) => {
      const resemail =
        /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (resemail.test(value)) {
        // 合法
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };

    // 验证手机规则
    var checkmobile = (rule, value, cb) => {
      const resmobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (resmobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };

    return {
      //获取用户列表必要的传入参数
      qureyinfo: {
        //搜索关键字
        qurey: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少天数据
        pagesize: 10,
      },
      userlist: [], //获取的用户信息
      total: 0, //数据列表
      addDialogVisible: false, //控制添加用户对话框的显示隐藏
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      }, //添加用户的表单数据
      addformrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名的长度在2到10个字符之间",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6到15个字符之间",
            trigger: ["blur", "change"],
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            // 调用checkemail方法里的正则来判断
            validator: checkemail,
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            // 正则同上
            validator: checkmobile,
            message: "请输入正确的手机号",
            trigger: ["blur", "change"],
          },
        ],
      },
      editdialogVisible: false, // 开关修改用户对话框的展示
      editform: {}, // 查询到的用户信息对象
      editformrules: {
        // 编辑用户信息的正则
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          {
            validator: checkemail,
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入用户手机号码", trigger: "blur" },
          {
            validator: checkmobile,
            message: "请输入正确的手机号",
            trigger: ["blur", "change"],
          },
        ],
      },
      setroledialogVisible: false, //控制分配对话框的显示
      userinfo: {}, //需要被分配角色的用户信息
      roleslist: [], //所有角色的数据列表
      selectedroleid: "", //已选中的角色id值
    };
  },

  methods: {
    // 进行get请求获取用户列表
    async getuserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.qureyinfo,
      }); //将数组qureyinfo里的值传入api获取users数组，通过async将params转化成data数组存入data: res中
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败");
      } //判断是否请求成功
      this.userlist = res.data.users; //赋值
      this.total = res.data.total; //赋值
    },
    // 监听pagesize事件
    handleSizeChange(newsize) {
      this.qureyinfo.pagesize = newsize;
      this.getuserlist();
    },
    // 监听页码值改变
    handleCurrentChange(newpage) {
      this.qureyinfo.pagenum = newpage;
      this.getuserlist();
    },
    // 监听swich开关状态的改变
    async userstatechange(userinfo) {
      // 传入id和mg_state开关状态
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      // 防止连续点击多次触发弹窗
      this.$message.closeAll();
      // 错误异常处理
      if (res.meta.status != 200) {
        userinfo.mg_state != userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      // 成功处理
      this.$message.success("更新用户状态成功");
    },
    // 关闭添加用户窗口时重置里面的信息
    addDialogclosed() {
      this.$refs.addformref.resetFields();
    },
    // 关闭编辑用户窗口时重置里面的信息
    adddialogclosed() {
      this.$refs.editformref.resetFields();
    },
    adduser() {
      // 点击确认添加用户时进行预校验
      this.$refs.addformref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addform);
        if (res.meta.status != 200) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功");
        //检验结束后关闭窗口
        this.addDialogVisible = false;
        // 重新获取列表信息
        this.getuserlist();
      });
    },
    // 点击确认编辑用户时进行预校验
    edituserinfo() {
      this.$refs.editformref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editform.id,
          {
            email: this.editform.email,
            mobile: this.editform.mobile,
          }
        );
        if (res.meta.status != 200) {
          this.$message.error("修改用户失败！");
        }
        //检验结束后关闭窗口
        this.editdialogVisible = false;
        // 提示成功
        this.$message.success("修改用户成功");

        // 重新获取列表信息
        this.getuserlist();
      });
    },
    // 打开编辑用户信息
    async showeditdialog(id) {
      // 通过id获取用户信息
      const { data: res } = await this.$http.get("users/" + id);
      this.editdialogVisible = true;
      if (res.meta.status != 200) {
        return this.$message.error("查询用户失败");
      }
      // 将信息绑定到私有变量editform里
      this.editform = res.data;
    },
    // 删除点击列
    async removeuserbyid(id) {
      // 弹框
      const confirmresult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
        // 用catch捕获报错并抛出
      ).catch((err) => err);
      // 判断抛出的是否为confirm
      if (confirmresult !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      // 如果不是confirm，就进行http请求来删除用户
      const { data: res } = await this.$http.delete("users/" + id);
      console.log(res.meta.status);
      if (res.meta.status != 200) {
        return this.$message.error("删除用户失败!");
      }
      this.$message.success("删除用户成功！");
      // 刷新
      this.getuserlist();
    },
    // 展示分配角色的对话框
    async setrole(userinfo) {
      this.userinfo = userinfo; //存值

      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表失败！");
      }
      this.roleslist = res.data;
      this.$message.success("获取角色列表成功！");
      this.setroledialogVisible = true;
    },
    // 点击按钮分配角色
    async saveroleinfo() {
      if (!this.selectedroleid) {
        return this.$message.error("请选择要分配的角色!");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userinfo.id}/role`,
        {
          rid: this.selectedroleid,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色失败！");
      }
      this.$message.success("更新角色成功！");
      this.getuserlist();
      this.setroledialogVisible = false;
    },
    // 监听分配角色对话框的关闭事件
    setroledialogclosed(){
this.selectedroleid = ''
this.userinfo = ''
    }
  },

  // 生命周期函数
  created() {
    this.getuserlist();
  },
};
</script> 

<style lang="less" scoped>
.text {
  font-size: 12px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
}
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important ;
}
.el-button:hover {
  background-color: rgb(31, 178, 223);
  border-radius: 0;
}
.el-el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>