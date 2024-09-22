<template>
    <div>
        <el-descriptions v-if="mpg.operations != null" :title="title" direction="vertical" :column="4" border>
            <el-descriptions-item label="Type" align="center">{{ mpg.type }}</el-descriptions-item>
            <el-descriptions-item label="Group name" align="center">
                <math-jax-view :latex="mpg.name"></math-jax-view>
            </el-descriptions-item>
            <el-descriptions-item label="Representation type">
                <el-radio-group v-model="representationType">
                    <el-radio label="single valued">single valued</el-radio>
                    <el-radio label="double valued">double valued</el-radio>
                </el-radio-group>
            </el-descriptions-item>
        </el-descriptions>
        <el-table v-if="mpg.representations != null"
            :data="mpg.representations.filter(data => data.type === representationType)" align="center">
            <el-table-column label="(Co-)Representations" align="center">
                <el-table-column width="150">
                    <template slot="header">
                        <math-jax-view latex="D_j"></math-jax-view>
                    </template>
                    <template slot-scope="scope">
                        <math-jax-view :latex="scope.row.name"></math-jax-view>
                    </template>
                </el-table-column>
                <el-table-column label="Operations" align="center">
                    <el-table-column v-for="(operation, i) in mpg.operations" :key="i" :label="operation" width="200">
                        <template slot="header">
                            <math-jax-view :latex="operation"></math-jax-view>
                        </template>
                        <template slot-scope="scope">
                            <el-scrollbar>
                                <math-jax-view
                                    :latex="'\\begin{pmatrix}' + scope.row.repMats[i].map(item => { return item.join('&'); }).join('\\\\') + '\\end{pmatrix}'"></math-jax-view>
                            </el-scrollbar>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import MathJaxView from "@/utils/MathJaxView.vue";
export default ({
    components: { MathJaxView },
    name: "MPGDescription",
    props: ["mpg", "title"],
    setup() {

    },
    data() {
        return {
            representationType: "single valued"
        }
    }
})
</script>
