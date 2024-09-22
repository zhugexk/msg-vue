<template>
    <el-container direction="vertical">
        <el-main>
            <MSGSelect @selectMSG="selectMSG"></MSGSelect>
            <el-radio-group v-model="representationType" size="medium">
                <el-radio label="single valued" border>single-valued</el-radio>
                <el-radio label="double valued" border>double-valued</el-radio>
            </el-radio-group>

        </el-main>
        <el-main>
            <t-subgroup-table v-if="isGetMSG" :tsubgroups="msg.tsubgroups"></t-subgroup-table>
            <div v-if="isGetMSG">
                <p>Select t-subgroup</p>
            </div>
            <el-select v-if="isGetMSG" v-model="subgroupIndex" @change="selectSubgroup">
                <el-option v-for="i in msg.tsubgroups.map(item => { return item.index })" :key="i" :label="i"
                    :value="i"></el-option>
            </el-select>
        </el-main>
        <el-main>
            <el-table :data="inputAIVector" v-if="isGetMSG" border>
                <el-table-column v-for="(item, i) in msg.aiBases[0].hspwithRepNameArray" :key="i">
                    <template slot="header">
                        <math-jax-view :latex="item"></math-jax-view>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row[i]"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="isGetMSG & isGetNoftubgroups">
                <el-button @click="calnoftsubgroupVector">calnoftsubgroup</el-button>
            </div>
            <div v-if="isGetMSG & isGetNoftubgroups">
                ({{ noftsubgroup[subgroupIndex][0].p.length }}),({{ noftsubgroup[subgroupIndex][0].p[0].length }})</div>
            <el-table :data="subgroupVector" v-if="isGetMSG & isGetNoftubgroups" border>
                <el-table-column v-for="(item, i) in noftsubgroup[subgroupIndex][0].subgroupHSPWithRepNameArray" :key="i">
                    <template slot="header">
                        <math-jax-view :latex="item"></math-jax-view>
                    </template>
                    <template slot-scope="scope">
                        <math-jax-view :latex="scope.row[i]"></math-jax-view>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
import MSGSelect from '@/component/MSGSelect.vue';
import TSubgroupTable from '@/component/TSubgroupTable.vue';
import MathJaxView from '@/utils/MathJaxView.vue';
import request from '@/js/request';
export default ({
    components: { MSGSelect, MathJaxView, TSubgroupTable },
    setup() { },
    data() {
        return {
            msg: {},
            representationType: "single valued",
            isGetMSG: false,
            isGetNoftubgroups: false,
            inputAIVector: [],
            subgroupIndex: 0,
            noftsubgroup: [],
            subgroupVector:[]
        }
    },
    methods: {
        selectMSG(value) {
            this.msg = value;
            request
                .get("/getNofTSubgroupById?id=" + this.msg.id)
                .then((result) => {
                    this.noftsubgroup = result.data.data;
                    console.log(this.noftsubgroup);
                    this.isGetNoftubgroups = true;
                });
            this.inputAIVector = [Array.from({ length: this.msg.aiBases[0].hspwithRepNameArray.length }, () => 0)];
            this.isGetMSG = true;
            console.log(this.msg);
        },
        selectSubgroup() {
            console.log(this.inputAIVector);
        },
        calnoftsubgroupVector() {
            request.post("/calNofTSubgourp", {
                "id": this.msg.id,
                "type": this.representationType,
                "subgroupIndex": this.subgroupIndex,
                "n": this.inputAIVector[0]
            }).then((result)=>{
                this.subgroupVector = [result.data];
            })
        }
    }
})
</script>
