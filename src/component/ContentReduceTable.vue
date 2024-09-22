<template>
    <el-table :data="contentReduces.filter(data => data.type === repType)"  style="margin-top: 20px"
        v-if="contentReduces != null">
        <el-table-column type="expand">
            <template slot-scope="expandScope">
                <el-table :data="expandScope.row.orbitalReduce.transformMat">
                    <el-table-column fixed>
                        <template slot-scope="orbitalBasesScope">
                            <math-jax-view
                                :latex="contentReduces.filter(data => data.type === repType)[expandScope.$index].orbitalReduce.orbitalBases[orbitalBasesScope.$index]"></math-jax-view>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item, i) in contentReduces.filter(data => data.type === repType)[expandScope.$index].orbitalReduce.repBases" :key="i" align="center">
                        <template slot="header">
                            <math-jax-view :latex="item"></math-jax-view>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row[i] }}
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-table-column>
        <el-table-column label="content" align="center">
            <template slot-scope="scope">
                <math-jax-view :latex="scope.row.content"></math-jax-view>
            </template>
        </el-table-column>
        <el-table-column prop="reduce" lable="reduce">
            <template slot-scope="scope">
                <math-jax-view :latex="scope.row.reduce.toString()"></math-jax-view>
            </template>
        </el-table-column>
        <el-table-column label="reduce" align="center">
            <template slot-scope="scope">
                <math-jax-view v-if="scope.row.reduceExpression != null"
                    :latex="scope.row.reduceExpression"></math-jax-view>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import MathJaxView from '@/utils/MathJaxView.vue';
export default ({
    name: "ContentReduceTable",
    components: { MathJaxView },
    props: ["contentReduces", "repType"],
    setup() {

    },
    mounted() {
        console.log(this.contentReduces);
    }
})
</script>
