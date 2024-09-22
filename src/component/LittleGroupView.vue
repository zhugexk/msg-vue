<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <div>
                    <el-table v-if="littlegroups != null" highlight-current-row @current-change="handleCurrentTableChange"
                        style="width: 100%" :data="littlegroups.slice((currentPage - 1) * 20, currentPage * 20)"
                        max-height="800" border>
                        <el-table-column label="HSP/L/PL" align="center">
                            <template slot-scope="scope">
                                <math-jax-view :latex="scope.row.kpointName"></math-jax-view>
                            </template>
                        </el-table-column>
                        <el-table-column label="Coordinate" align="center">
                            <template slot-scope="scope">
                                <math-jax-view
                                    :latex="'(' + scope.row.coordinateByVariable.toString() + ')'"></math-jax-view>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handlePaginationSizeChange" @current-change="handleCurrentPaginationChange"
                        :current-page.sync="currentPage" :page-size="20" layout="total, prev, pager, next, jumper"
                        :total="littlegroups.length">
                    </el-pagination>
                </div>
            </el-col>
            <el-col :span="16">
                <el-descriptions v-if="littlegroupDetail != null" style="width:100%" title="Little group detail" :column="5"
                    direction="vertical" border>
                    <el-descriptions-item label="HSP/L/PL">
                        <math-jax-view :latex="littlegroupDetail.kpointName"></math-jax-view>
                    </el-descriptions-item>
                    <el-descriptions-item label="Coordinate">
                        <math-jax-view
                            :latex="'(' + littlegroupDetail.coordinateByVariable.toString() + ')'"></math-jax-view>
                    </el-descriptions-item>
                    <el-descriptions-item v-if="littlegroupDetail.kpointType > 1" label="Direction">
                        <math-jax-view
                            :latex="littlegroupDetail.coordinateByPoint.map((direction) => { return '(' + direction.toString() + ')' }).toString()"></math-jax-view>
                    </el-descriptions-item>
                    <el-descriptions-item label="Bilbao msg name">{{ littlegroupDetail.bilbao.msgName }}
                    </el-descriptions-item>
                    <el-descriptions-item label="k-vector label">
                        <math-jax-view :latex="littlegroupDetail.bilbao.kpoint"></math-jax-view>
                    </el-descriptions-item>
                    <el-descriptions-item label="Components in the conventional basis">
                        <math-jax-view :latex="'(' + littlegroupDetail.bilbao.coordinate.toString() + ')'"></math-jax-view>
                    </el-descriptions-item>
                    <el-descriptions-item label="Select irrep">
                        <el-radio-group v-model="repType" style="margin-top: 20px" border>
                            <el-radio label="single valued">single valued</el-radio>
                            <el-radio label="double valued">double valued</el-radio>
                        </el-radio-group>
                        <div style="padding:5px"></div>
                        <el-select v-if="repType == 'single valued'" v-model="repName">
                            <el-option v-for="irrep in littlegroupDetail.singleIrreps" :key="irrep" :label="irrep"
                                :value="irrep"></el-option>
                        </el-select>
                        <el-select v-else v-model="repName">
                            <el-option v-for="irrep in littlegroupDetail.doubleIrreps" :key="irrep" :label="irrep"
                                :value="irrep"></el-option>
                        </el-select>
                    </el-descriptions-item>
                    <el-descriptions-item label="Bilbao irrep name">
                        <math-jax-view :latex="representationDetail.bilbaoRepName"></math-jax-view>
                    </el-descriptions-item>
                    <el-descriptions-item label="Operations and irrep mats">
                        <el-popover trigger="hover" placement="top">
                            <el-table :data="littlegroupDetail.operations" style="width:100%" max-height="600" border>
                                <el-table-column label="Operations" width="250">
                                    <template slot-scope="scope">
                                        <math-jax-view
                                            :latex="'\\{' + scope.row.rotation + '|' + scope.row.translation.toString() + '\\}'"></math-jax-view>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Irrep mats" width="800">

                                    <template slot-scope="scope">
                                        <el-scrollbar>
                                            <math-jax-view
                                                :latex="'\\begin{pmatrix}' + representationDetail.repMats[scope.$index].map(item => { return item.join('&'); }).join('\\\\') + '\\end{pmatrix}'"></math-jax-view>
                                        </el-scrollbar>
                                    </template>

                                </el-table-column>
                            </el-table>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">
                                    Show all operations
                                </el-tag>
                            </div>
                        </el-popover>
                    </el-descriptions-item>
                    <el-descriptions-item v-if="littlegroupDetail.timeReverseOperation != null"
                        label="Anti-unitary operation">
                        <el-popover trigger="hover" placement="top">
                            <math-jax-view
                                :latex="'\\begin{pmatrix}' + representationDetail.timeReverseRepMat.map(item => { return item.join('&'); }).join('\\\\') + '\\end{pmatrix}'"></math-jax-view>
                            <div slot="reference">
                                <math-jax-view
                                    :latex="'\\Theta' + '\\{' + littlegroupDetail.timeReverseOperation.rotation + '|' + littlegroupDetail.timeReverseOperation.translation.toString() + '\\}'"></math-jax-view>
                            </div>
                        </el-popover>
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import MathJaxView from "@/utils/MathJaxView.vue"

export default ({
    components: { MathJaxView },
    name: "LittleGroupView",
    props: ["littlegroups"],
    setup() {

    },
    data() {
        return {
            currentPage: 1,
            littlegroupDetail: this.littlegroups[0],
            repType: "single valued",
            repName: this.littlegroups[0].singleIrreps[0],
            representationDetail: this.littlegroups[0].representations[0]
        }
    },
    methods: {
        handlePaginationSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentPaginationChange(val) {
            console.log(`当前页: ${val}`);
        },
        handleCurrentTableChange(currentRow) {
            if (currentRow != this.littlegroupDetail) {
                this.littlegroupDetail = currentRow;
                console.log(this.littlegroupDetail);
            }
        }
    },
    watch: {
        littlegroupDetail() {
            this.repType = "single valued";
            this.repName = this.littlegroupDetail.singleIrreps[0];
        },
        repName() {
            let repIndex = this.littlegroupDetail.representations.findIndex((rep) => rep.repName == this.repName && rep.repType == this.repType)
            if (repIndex < 0 || repIndex > this.littlegroupDetail.representations.length) return;
            this.representationDetail = this.littlegroupDetail.representations[repIndex];
        },
        repType() {
            let repIndex = this.littlegroupDetail.representations.findIndex((rep) => rep.repName == this.repName && rep.repType == this.repType)
            if (repIndex < 0 || repIndex > this.littlegroupDetail.representations.length) return;
            this.representationDetail = this.littlegroupDetail.representations[repIndex];
        }
    }
})
</script>
