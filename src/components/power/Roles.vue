<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="rolelist" border stripe>
        <!-- expand展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级 -->
              <el-col :span="5">
                <el-tag closable @close="removerightbyid(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级 -->
              <el-col :span="19">
                <!-- 通过for 嵌套渲染二级 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removerightbyid(scope.row, item2.id)"
                    >
                      {{ i2 }}
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removerightbyid(scope.row, item3.id)"
                    >
                      {{ i3 }}
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- index索引列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="500px">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="400px">
        </el-table-column>
        <el-table-column label="操作" width="400px">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-adit"
              size="mani"
              autofocus
              @click="showroles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mani"
              @click="deleteroles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mani"
              @click="showsetright(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色区域start -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogclosed"
    >
      <!-- sync判断是否显示对话框，@close在关闭时清空 -->
      <!-- 内容主体 -->
      <el-form
        :model="addrolesform"
        :rules="addrolesformrules"
        label-width="80px"
        ref="addformref"
      >
        <!-- 添加用户验证表单 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addrolesform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addrolesform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrolesuser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色用户区域end -->

    <!-- 修改角色信息区域start -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="showrolesVisible"
      width="50%"
      @close="showDialogclosed"
    >
      <!-- sync判断是否显示对话框，@close在关闭时清空 -->
      <!-- 内容主体 -->
      <el-form
        :model="addrolesform"
        :rules="addrolesformrules"
        label-width="80px"
        ref="showformref"
      >
        <!-- 修改用户验证表单 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="showrolesform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="showrolesform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer">
        <el-button @click="showrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="showrolesuser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色信心用户区域end -->

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setrightdialogvisible"
      width="50%"
      @close="setrightdialogclosed"
    >
      <!-- 树形结构控件 -->
      <el-tree
        :data="rightslist"
        :props="treeprops"
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        show-checkbox
        ref="treeref"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setrightdialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="allotrights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      dialogVisible: false, //控制添加用户对话框的显示隐藏
      showrolesVisible: false, //控制修改用户信息对话框的显示隐藏
      setrightdialogvisible: false, //控制权限分配对话框显示
      addrolesform: {
        roleName: "",
        roleDesc: "",
      }, //添加角色的表单数据
      showrolesform: {}, //点击修改后查询到的信息
      rightslist: [], //保存的权限列表
      roleId: [], //即将分配权限的id
      treeprops: {
        label: "authName",
        children: "children",
      }, //树形控件的属性绑定对象
      // 默认选中的节点id值数组
      defkeys: [],
      addrolesformrules: {
        rolesname: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "角色名称的长度在3到10个字符之间",
            trigger: ["blur", "change"],
          },
        ],
        roleslevel: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "角色描述的长度在3到50个字符之间",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  methods: {
    async getROleslist() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolelist = res.data;
    },

    addDialogclosed() {
      // 关闭添加窗口时清空
      this.$refs.addformref.resetFields();
    },
    showDialogclosed() {
      // 关闭添加窗口时清空
      this.$refs.showformref.resetFields();
    },
    addrolesuser() {
      // 点击确认添加角色时进行预校验
      this.$refs.addformref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addrolesform);
        if (res.meta.status != 200) {
          this.$message.error("添加角色失败！");
        }

        this.$message.success("添加角色成功");
        console.log(res.meta.status);
        //检验结束后关闭窗口
        this.dialogVisible = false;
        // 重新获取列表信息
        this.getROleslist();
      });
    },
    // 点击编辑时
    async showroles(id) {
      this.showrolesVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      this.editdialogVisible = true;
      if (res.meta.status != 200) {
        return this.$message.Error("查询用户失败");
      }
      // 将信息绑定到私有变量editform里
      this.showrolesform = res.data;
    },
    // 点击编辑界面里的确定按钮
    showrolesuser() {
      this.$refs.showformref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.showrolesform.roleId,
          {
            roleName: this.showrolesform.roleName,
            roleDesc: this.showrolesform.roleDesc,
          }
        );
        if (res.meta.status != 200) {
          this.$message.error("修改用户失败！");
        }
        //检验结束后关闭窗口
        this.showrolesVisible = false;
        // 提示成功
        this.$message.success("修改用户成功");

        // 重新获取列表信息
        this.getROleslist();
      });
    },
    // 点击删除按钮
    async deleteroles(id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("删除用户失败!");
      }
      this.$message.success("删除用户成功！");
      // 刷新
      this.getROleslist();
    },
    // 根据id删除权限tag
    async removerightbyid(role, rightid) {
      // 弹框提示用户是否删除用户
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除！");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      );

      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      // 为了防止删除后自动关闭下拉，用请求后最新的数据赋值来代替。
      role.children = res.data;
    },
    // 点击分配权限展示对话框
    async showsetright(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限用户数据失败！");
      }
      // 把获取到的权限数据保存到数据当中
      this.rightslist = res.data;
      // 递归获取三级节点的id
      this.getleafkeys(role, this.defkeys);
      this.setrightdialogvisible = true;
    },
    //通过递归形式获取角色下所有三级权限的id并保存
    getleafkeys(node, arr) {
      if (!node.children) {
        // 如果当前node 节点不包含 children
        // 则是三级节点
        return arr.push(node.id);
      } else {
        node.children.forEach((item) => this.getleafkeys(item, arr));
      }
      // 点击角色权限将rw传入showget方法，方法调用此递归方法并将row传入
    },
    // 监听分配权限对话框的关闭事件
    setrightdialogclosed() {
      this.defkeys = [];
    },
    async allotrights() {
      // 点击为角色分配权限
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(),//获取被选中权限的id
        ...this.$refs.treeref.getHalfCheckedKeys(),//获取半选中权限的id
      ];
      const idsdr = keys.join(","); //为每个数据间加个逗号
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idsdr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功！");
      this.getROleslist();
      this.setrightdialogvisible = false;//关闭修改对话框
      console.log(keys);
    },
  },

  created() {
    this.getROleslist();
  },
};
</script> 

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>