<template>
    <el-table :data=basisVectors style="width: 100%" border>
        <el-table-column fixed>
            <template slot-scope="scope">
                <math-jax-view v-if="vectorNames == null" :latex="'\\vec{a}_' + (scope.$index + 1)"></math-jax-view>
                <math-jax-view v-else
                    :latex="vectorNames.filter(data => data.type == repType)[scope.$index].name"></math-jax-view>
            </template>
        </el-table-column>
        <el-table-column :label="title" header-align="center">
            <el-table-column v-for="(item, i) in hspwithRepNameArray" :key="i">
                <template slot="header">
                    <math-jax-view :latex="item"></math-jax-view>
                </template>
                <template slot-scope="scope">
                    {{ scope.row[i] }}
                </template>
            </el-table-column>
        </el-table-column>
    </el-table>
</template>

<script>
import MathJaxView from '@/utils/MathJaxView.vue';
export default ({
    components: { MathJaxView },
    name: "AIVectorTable",
    props: [
        "AIVector",
        "repType",
        "title",
        "vectorNames",
    ],
    setup() {

    },
    data() {
        return {
            basisVectors: [],
            hspwithRepNameArray: [],
        }
    },
    mounted() {
        this.setData();
    },
    watch: {
        AIVector() {
            this.setData();
        },
        repType() {
            this.setData();
        }
    },
    methods: {
        setData() {
            for (let i = 0; i < this.AIVector.length; i++) {
                if (this.AIVector[i].type == this.repType) {
                    this.basisVectors = this.AIVector[i].basisVectors;
                    this.hspwithRepNameArray = this.AIVector[i].hspwithRepNameArray;
                }
            }
        }
    }
})
</script>
