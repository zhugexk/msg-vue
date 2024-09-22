<template>
    <el-container>
        <el-main>
            <MSGSelect @selectMSG="selectMSG"></MSGSelect>
            <el-row>
                <el-button type="primary" @click="getkdotpButtonClicked">get kdotp</el-button>
            </el-row>
            <el-divider></el-divider>
            <el-table v-if="hspbn" :data="hspbn">
                <el-table-column label="hsp" width="150" align="center" border>
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <el-table :data="scope.row.equalHSPs">
                                <el-table-column label="name" width="150" align="center">
                                    <template slot-scope="scope">
                                        <math-jax-view :latex="scope.row.name">
                                        </math-jax-view>
                                    </template>
                                </el-table-column>
                                <el-table-column label="position" width="150" align="center">
                                    <template slot-scope="scope">
                                        <math-jax-view :latex="'\\{' + scope.row.position.toString() + '\\}'">
                                        </math-jax-view>
                                    </template>
                                </el-table-column>
                                <el-table-column label="operation" width="150" align="center">
                                    <template slot-scope="scope">
                                        <math-jax-view :latex="scope.row.operation">
                                        </math-jax-view>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div slot="reference">
                                <math-jax-view :latex="scope.row.equalHSPs[0].name"></math-jax-view>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="kdotp" align="center">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.kdotp" border>
                            <el-table-column prop="repName" label="repName" width="150">
                                <template slot-scope="scope">
                                    <math-jax-view :latex="scope.row.repName"></math-jax-view>
                                </template>
                            </el-table-column>
                            <el-table-column prop="mat" label="mat" max-width="700">
                                <template slot-scope="scope">
                                    <math-jax-view
                                        :latex="'\\begin{pmatrix}' + scope.row.mat.map(item => { return item.join('&'); }).join('\\\\') + '\\end{pmatrix}'"></math-jax-view>
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" label="type" width="150"></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
import MSGSelect from '@/component/MSGSelect.vue';
import request from '@/js/request';
import MathJaxView from '@/utils/MathJaxView.vue';
export default ({
    components: { MSGSelect, MathJaxView },
    setup() {

    },
    data() {
        return {
            msg: {},
            hspbn: []
        }
    },
    methods: {
        selectMSG(value) {
            this.msg = value;
        },
        getkdotpButtonClicked() {
            if (this.msg == null) {
                return
            }
            request.get("/getHSPBNbyMSGId" + "?msgId=" + this.msg.id).then(result => {
                this.hspbn = result.data.hspbn;
            }).catch(error => {
                console.log(error);
            })
        },
    }
})
</script>
