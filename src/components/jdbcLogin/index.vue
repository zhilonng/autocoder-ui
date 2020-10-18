<template>
    <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false">
        <div slot="title">
            <h1>JDBC连接</h1>
        </div>
        <div>
            <el-form ref="form" label-width="80px" autocomplete="on">
                <el-form-item label="JDBC地址">
                    <el-input v-model="formData.jdbcUrl"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formData.password"></el-input>
                </el-form-item>
            </el-form>
            <div style="color: #F56C6C;" v-if="showErrorTig">
                请检查您的地址，用户名，密码是否填写有误
            </div>
            <el-button type="success" style="width:100%;margin-bottom:20px;" @click="testConnectJdbc">测试连接</el-button>
            <el-button type="primary" style="width:100%;margin-bottom:30px;margin-left: 0px;" @click="connectJdbc">开启应用</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { doGet, doPost, doDelet, doPut } from '../../util/request'
    export default {
        name: "index",
        data() {
            return {
                visible: false,
                formData: {
                    jdbcUrl: 'jdbc:mysql://120.78.162.148:3306/jeecg-boot?characterEncoding=UTF-8&useUnicode=true&useSSL=false&tinyInt1isBit=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai',
                    name: 'root',
                    password: 'AIRbriagE1001'
                },
                showErrorTig: false
            }
        },
        methods: {
            show() {
                this.visible = true
            },
            close() {
                this.visible = false
            },
            handleJdbc() {
                this.close()
            },
            connectJdbc() {
                const vm = this
                doPost("/jdbc/connect", vm.formData).then(res => {
                    if (res.data.code === 0) {
                        vm.showErrorTig = false
                        vm.$message.success("连接成功")
                        vm.$emit("loginSuccess")
                        vm.close()
                    } else {
                        vm.showErrorTig = true
                        vm.$message.error("连接失败")
                    }
                })
            },
            testConnectJdbc() {
                const vm = this
                doPost("/jdbc/testConnect", vm.formData).then(res => {
                    if (res.data.code === 0) {
                        vm.showErrorTig = false
                        vm.$message.success("连接成功")
                        vm.$emit("loginSuccess")

                    } else {
                        vm.showErrorTig = true
                        vm.$message.error("连接失败")
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
