<template>
    <div>
        <el-radio-group v-model="hspIndex">
            <el-radio-button v-for="(item, i) in hspbn.hspbn" :key="i" :label="i" :value="i">
                <math-jax-view :latex="item.indHSP.name"></math-jax-view>
            </el-radio-button>
        </el-radio-group>
        <!-- k-vector -->
        <el-table v-if="hspbn.hspbn[hspIndex].equalHSPs != null" :data="hspbn.hspbn[hspIndex].equalHSPs"
            style="margin-top: 20px" border>
            <el-table-column label="k-star" align="center">
                <el-table-column label="name" align="center">
                    <template slot-scope="scope">
                        <math-jax-view :latex="scope.row.name"></math-jax-view>
                    </template>
                </el-table-column>
                <el-table-column label="coordinate" align="center">
                    <template slot-scope="scope">
                        <math-jax-view :latex="'(' + scope.row.position.toString() + ')'"></math-jax-view>
                    </template>
                </el-table-column>
                <el-table-column label="operation" align="center">
                    <template slot-scope="scope">
                        <math-jax-view :latex="scope.row.operation"></math-jax-view>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-radio-group v-model="repType" style="margin-top: 20px" border>
            <el-radio label="single valued">single valued</el-radio>
            <el-radio label="double valued">double valued</el-radio>
        </el-radio-group>
        <!--Group representation table-->
        <el-table v-if="hspbn.hspbn[hspIndex].indHSP.representations != null"
            :data="hspbn.hspbn[hspIndex].indHSP.representations.filter(data => data.type === repType)"
            style="width: 100%; margin-top: 20px" :row-key="getRowKey" :expand-row-keys="expands"
            @expand-change="expandChange" @row-click="rowClicked">
            <el-table-column type="expand" fixed>
                <template slot-scope="expandScope">
                    <!-- <div v-if="hsl != null">
                        {{ hsl.lowerSymInfos[expandScope.$index] }}
                    </div> -->
                    <el-table v-if="hsl!=null" :data="hsl.lowerSymInfos[expandScope.$index].transformMat">
                    <el-table-column fixed>
                        <template slot-scope="repBasesScope">
                            <math-jax-view
                                :latex="hsl.lowerSymInfos[expandScope.$index].repBases[repBasesScope.$index]"></math-jax-view>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item, i) in hsl.lowerSymInfos[expandScope.$index].subgroupBases" :key="i" align="center">
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
                <el-table-column v-for="(operation, i) in hspbn.hspbn[hspIndex].indHSP.operations" :key="i"
                    :label="operation" width="100">
                    <template slot="header">
                        <math-jax-view :latex="operation"></math-jax-view>
                    </template>
                    <template slot-scope="scope">
                        <math-jax-view :latex="scope.row.characters[i]"></math-jax-view>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-drawer title="Select direction" :visible.sync="drawer" :with-header="false">
            <el-table :data="hspbn.hspbn[hspIndex].hsls" ref="directionTable" highlight-current-row
                @row-click="directionTableRowClicked">
                <el-table-column label="direction" align="center">
                    <template slot-scope="scope">
                        <math-jax-view v-if="(typeof scope.row.direction[0] == 'string')"
                            :latex="'(' + scope.row.direction.toString() + ')'"></math-jax-view>
                        <math-jax-view v-else
                            :latex="'(' + scope.row.direction[0].toString() + '), ' + '(' + scope.row.direction[1].toString() + ')'"></math-jax-view>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>
        <!-- kdotp -->
        <el-table v-if="hspbn.hspbn[hspIndex].kdotp != null"
            :data="hspbn.hspbn[hspIndex].kdotp.filter(data => data.type === repType)" style="margin-top: 20px; width: 100%"
            border>
            <el-table-column prop="repName" label="Representation name in band node" width="300">
                <template slot-scope="scope">
                    <math-jax-view :latex="scope.row.repName"></math-jax-view>
                </template>
            </el-table-column>
            <el-table-column label="kdotp model aroud band node" min-width="400" align="center">
                <template slot-scope="scope">
                    <el-scrollbar>
                        <math-jax-view
                            :latex="'\\begin{pmatrix}' + scope.row.mat.map(item => { return item.join('&'); }).join('\\\\') + '\\end{pmatrix}'"></math-jax-view>
                    </el-scrollbar>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import MathJaxView from "@/utils/MathJaxView.vue"
export default ({
    components: { MathJaxView },
    name: "HSPBNView",
    props: ["hspbn"],
    setup() {

    },
    data() {
        return {
            hspIndex: 0,
            repType: "single valued",
            expands: [],
            repName: '',
            drawer: false,
            hsl: {}
        }
    },
    methods: {
        getRowKey(row) {
            return row.name;
        },
        expandChange(row) {
            this.expands = [];
            if (row.name != this.repName) {
                this.hsl = this.hspbn.hspbn[this.hspIndex].hsls[0];
                this.expands.push(row.name);
                this.repName = row.name;
                this.drawer = true;
            } else {
                this.repName = '';
            }
        },
        rowClicked(row) {
            this.expandChange(row);
        },
        directionTableRowClicked(row) {
            if (this.hsl != row) {
                this.hsl = row
                console.log(row);
            }
        }
    }
})
</script>
