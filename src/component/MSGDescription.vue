<template>
    <div>
        <el-row type="flex" :gutter="20">
            <el-col :span="12">
                <el-tooltip effect="dark" content="Translation Subgroup" placement="bottom">
                    <math-jax-view :latex="'T'"></math-jax-view>
                </el-tooltip>
            </el-col>
            <el-col :span="12">
                <el-tooltip effect="dark" content="Cosets Representatives Decomposed By Translation Subgroup" placement="bottom">
                    <math-jax-view :latex="'G/T'"></math-jax-view>
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="20">
            <el-col :span="12">
                <el-descriptions :column="3" direction="vertical" border>
                    <el-descriptions-item label="Bravais Lattice">{{ msg.bravaisLattice.info }}</el-descriptions-item>
                    <el-descriptions-item label="Label"><math-jax-view
                            :latex="msg.bravaisLattice.name"></math-jax-view></el-descriptions-item>
                </el-descriptions>
                <el-descriptions :column="1" direction="vertical" border>
                    <el-descriptions-item label="Basis vectors for conventional lattice"><math-jax-view
                            :latex="msg.bravaisLattice.conventionalBasicVectors.map((item, index) => { return `\\vec{a}_{${index + 1}}` + '=(' + item.toString() + ')' }).toString()"></math-jax-view>
                    </el-descriptions-item>
                    <el-descriptions-item label="Basis vectors for primitive lattice:"><math-jax-view
                            :latex="msg.bravaisLattice.primitiveBasicVectors.map((item, index) => { return `\\vec{t}_{${index + 1}}` + '=(' + item.toString() + ')' }).toString()"></math-jax-view>
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
            <el-col :span="12">
                <el-table :data="msg.operations" style="width:100;text-align: center;" max-height="400" border>
                    <el-table-column label="Operation">%
                        <template slot-scope="scope">
                            <math-jax-view v-if="scope.row.isTimeInversal"
                                :latex="'\\Theta\\{' + scope.row.rotation + '|' + scope.row.translation.toString() + '\\}'"></math-jax-view>
                            <math-jax-view v-else
                                :latex="'\\{' + scope.row.rotation + '|' + scope.row.translation.toString() + '\\}'"></math-jax-view>
                        </template>
                    </el-table-column>
                    <el-table-column label="Det">
                        <template slot-scope="scope">
                            <math-jax-view :latex="scope.row.pointGroupOperation.det.toString()"></math-jax-view>
                        </template>
                    </el-table-column>
                    <el-table-column label="Rotation axis">
                        <template slot-scope="scope">
                            <math-jax-view
                                :latex="'(' + scope.row.pointGroupOperation.axis.toString() + ')'"></math-jax-view>
                        </template>
                    </el-table-column>
                    <el-table-column label="Rotation angle">
                        <template slot-scope="scope">
                            <math-jax-view :latex="scope.row.pointGroupOperation.angle"></math-jax-view>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import MathJaxView from "@/utils/MathJaxView.vue";
export default ({
    components: { MathJaxView },
    name: "MSGDescription",
    props: ["msg"],
    setup() {

    },
    data() {
        return {

        }
    }
})
</script>