<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightslist" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot:default="scope">
                  <!-- scope 作用域插槽 -->
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
             <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 权限列表
      rightslist: [],
    };
  },

  methods: {
    // 获取权限列表
    async getrightslist() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status != 200) {
        return this.$message.error("获取权限列表失败！");
      }
      //   赋值给rightslist
      this.rightslist = res.data;
      console.log(this.rightslist);
    },
  },

  created() {
    // 获取所有的权限
    this.getrightslist();
  },
};
</script> 

<style lang="less" scope>
</style>