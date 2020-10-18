<template>
  <div>
    <el-row>
      <el-col>
        <el-card style="margin: 10px;" class="myCard">
          <el-form inline="" label-width="140px">
            <el-col :span="24">
              <el-col :span="8">
                <el-form-item label="作者" >
                  <el-input autocomplete v-model="outputForm.author" style="width: 100%;" placeholder="请输入作者"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="包名" >
                  <el-input autocomplete v-model="outputForm.packageName" style="width: 100%;" placeholder="请输入包名"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Controller输出路径" >
                <el-input autocomplete v-model="outputForm.controllerOutputPath" style="width: 100%;" placeholder="请输入Controller输出路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Service输出路径">
                <el-input autocomplete v-model="outputForm.serviceOutputPath" placeholder="请输入Service输出路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Dao输出路径">
                <el-input autocomplete v-model="outputForm.daoOutputPath" placeholder="请输入Dao输出路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Entity输出路径">
                <el-input autocomplete v-model="outputForm.entityOutputPath" placeholder="请输入Entity输出路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Mapper输出路径">
                <el-input autocomplete v-model="outputForm.mapperOutputPath" placeholder="请输入Mapper输出路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Xml输出路径">
                <el-input autocomplete v-model="outputForm.xmlOutputPath" placeholder="请输入Xml输出路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="">
                <el-button type="primary" @click="generateCodeTemplate">生成代码</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card style="margin: 10px;" class="myCard">
          <el-form inline>
            <el-form-item label="表名:" style="margin-bottom: 10px">
              <el-input v-model="searchForm.tableName" placeholder="请输入关键字..." style="width: 220px"></el-input>
            </el-form-item>
            <el-form-item label="表描述:" style="margin-bottom: 10px">
              <el-input v-model="searchForm.tableDesc" placeholder="请输入关键字..." style="width: 220px"></el-input>
            </el-form-item>
            <el-button type="primary" @click="getTables">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form>

          <el-table
                  v-infinite-scroll="load"
                  :data="tableData"
                  ref="multipleTable"
                  v-loading="listLoading"
                  element-loading-text="拼命加载中"
                  border
                  fit
                  :height="height"
                  @selection-change="handleSelectionChange"
                  highlight-current-row>
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="TABLE_NAME"
                    label="表名"
                    width="240">
            </el-table-column>
            <el-table-column
                    prop="TABLE_COMMENT"
                    label="表描述"
                    min-width="300">
            </el-table-column>
            <el-table-column
                    prop="TABLE_SCHEMA"
                    label="创建人"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="ENGINE"
                    label="引擎"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="CREATE_TIME"
                    label="创建时间"
                    width="250">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="margin-top: 15px;">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageConfig.page"
                    :page-sizes="[10, 20, 40, 60, 100]"
                    :page-size="pageConfig.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
          </div>

        </el-card>
      </el-col>
      <jdbc-login ref="jdbcLogin" @loginSuccess="loginSuccess"></jdbc-login>
    </el-row>
  </div>
</template>

<script>
  import { doGet, doPost, doDelet, doPut } from './util/request'
  import JdbcLogin from './components/jdbcLogin/index'
  export default {
    components: {JdbcLogin},
    data() {
      return {
        tableData: [],
        total: 0,
        listLoading: false,
        height: window.innerHeight - 160,
        searchForm: {
          tableName: '',
          tableDesc: ''
        },
        pageConfig: {
          page: 1,
          size: 10
        },
        outputForm: {
          author: 'zhilonng',
          packageName: '/com/cj/tools',
          controllerOutputPath: '/Users/zhilonng/Documents/test/autocoder/autocoder-server/src/main/java/com/cj/tools/test/',
          serviceOutputPath: '/Users/zhilonng/Documents/test/autocoder/autocoder-server/src/main/java/com/cj/tools/test/',
          daoOutputPath: '/Users/zhilonng/Documents/test/autocoder/autocoder-server/src/main/java/com/cj/tools/test/',
          entityOutputPath: '/Users/zhilonng/Documents/test/autocoder/autocoder-server/src/main/java/com/cj/tools/test/',
          mapperOutputPath: '/Users/zhilonng/Documents/test/autocoder/autocoder-server/src/main/java/com/cj/tools/test/',
          xmlOutputPath: '/Users/zhilonng/Documents/test/autocoder/autocoder-server/src/main/java/com/cj/tools/test/'
        },
        multipleSelection: []
      }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
          const vm = this
          doGet("/jdbc/isConnecting", {}).then(res => {
            if (res.data.code === 0) {
              vm.getTables()
            } else {
              vm.$refs.jdbcLogin.show()
            }
          })
        },
        getTables() {
          const vm = this
          vm.listLoading = true
          doGet("/db/tables", Object.assign(vm.searchForm, vm.pageConfig)).then(res => {
            vm.listLoading = false
            if (res.data.code === 0) {
              vm.tableData = res.data.data.list
              vm.total = res.data.data.total
            } else {
              vm.tableData = []
              vm.$refs.jdbcLogin.show()
            }
          })
        },
        generateCodeTemplate() {
          const vm = this
          if (vm.multipleSelection.length == 0) {
            vm.$message.error("请选择要生成的表")
            return
          }
          var tableName = []
          vm.multipleSelection.forEach(item => {
            tableName.push(item.TABLE_NAME)
          })
          doPost("/coder/generate", Object.assign(vm.outputForm, {
            tableName: tableName.join(',')
          })).then(res => {
            if (res.data.code === 0) {
              vm.$message.success("生成成功")
            }
          })
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleSizeChange(val) {
          this.pageConfig.size = val
          this.getTables()
        },
        handleCurrentChange(val) {
          this.pageConfig.page = val
          this.getTables()
        },
        loginSuccess() {
          this.getTables()
        },
        reset() {
          this.searchForm.tableName = ''
          this.searchForm.tableDesc = ''
        }
    }
  }
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
/*.el-form-item__content{*/
/*  width: 50%;*/
/*}*/
</style>
