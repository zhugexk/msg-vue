<template>
    <div>
        <el-table v-if="tsubgroups != null" :data="tsubgroups.tsubgroups.slice((currentPage - 1) * 20, currentPage * 20)"
            max-height="500" border>
            <el-table-column label="t-Subgroups" header-align="center">
                <el-table-column prop="index" label="index" header-align="center" align="center"></el-table-column>
                <el-table-column prop="delta" label="delta" header-align="center">
                    <template slot="header">
                        <math-jax-view :latex="'\\delta'"></math-jax-view>
                    </template>
                    <template slot-scope="scope">
                        <math-jax-view :latex="'(' + scope.row.delta.toString() + ')'"></math-jax-view>
                    </template>
                </el-table-column>
                <el-table-column label="P" header-align="center">
                    <template slot-scope="scope">
                        <math-jax-view
                            :latex="'\\begin{pmatrix}' + scope.row.p.map(item => { return item.join('&'); }).join('\\\\') + '\\end{pmatrix}'"></math-jax-view>
                    </template>
                </el-table-column>
                <el-table-column prop="groupName" label="Group Name" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <el-table :data="scope.row.operations" height="250" border>
                                <el-table-column label="operations">
                                    <template slot-scope="scope">
                                        <math-jax-view v-if="scope.row.isTimeInversal"
                                            :latex="'{\\Theta}' + scope.row.rotation"></math-jax-view>
                                        <math-jax-view v-else :latex="scope.row.rotation"></math-jax-view>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">
                                    {{ scope.row.groupName }}
                                </el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="groupType" label="Group Type" header-align="center" align="center"></el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page.sync="currentPage"  :page-size="20"
            layout="total, prev, pager, next, jumper" :total="tsubgroups.tsubgroups.length">
        </el-pagination>
    </div>
</template>

<script>
import MathJaxView from "@/utils/MathJaxView.vue";
export default ({
    component: { MathJaxView },
    name: "TSubgroupTable",
    props: [
        "tsubgroups",
    ],
    setup() {
    },
    components: { MathJaxView },
    data() {
        return {
            currentPage: 1,
        }
    },
    methods: {
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
})
</script>
