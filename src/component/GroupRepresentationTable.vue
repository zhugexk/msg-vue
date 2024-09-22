<template>
    <el-table v-if="representations != null" :data="representations.filter(data => data.type === type)" style="width: 100%" align="center">
        <!-- <el-table-column :label="title" align="center"> -->
        <el-table-column width="100" fixed>
            <template slot="header">
                <math-jax-view :latex="'\\chi^{j}_k'"></math-jax-view>
            </template>
            <template slot-scope="scope">
                <math-jax-view :latex="scope.row.name"></math-jax-view>
            </template>
        </el-table-column>
        <el-table-column>
            <template slot="header"><math-jax-view :latex="'G_0(k)'"></math-jax-view></template>
            <el-table-column v-for="(operation, i) in operations" :key="i" :label="operation" width="100">
                <template slot="header">
                    <math-jax-view :latex="operation"></math-jax-view>
                </template>
                <template slot-scope="scope">
                    <math-jax-view :latex="scope.row.characters[i]"></math-jax-view>
                </template>
            </el-table-column>
        </el-table-column>
        <!-- </el-table-column> -->
    </el-table>
</template>

<script>
import MathJaxView from '@/utils/MathJaxView.vue';
export default ({
    components: { MathJaxView },
    name: "GroupRepresentationTable",
    props: [
        "representations",
        "operations",
        "title",
        "type",
    ],
    setup() {

    }
})
</script>
