<template>
    <div>
        <el-button type="text" @click="dialogSelectVisible = true">Select Magnetic Space Group(MSG) In
            Belov-Neronova-Smirnova(BNS) Notation</el-button>
        <el-dialog :visible.sync="dialogSelectVisible">
            <el-form :model="dialogSelectInfo">
                <el-form-item label="Group Type" :label-width="formLabelWidth">
                    <el-select v-model="dialogSelectInfo.groupTypes" multiple collapse-tags
                        placeholder="please select type" @change="groupTypeChange">
                        <el-option v-for="item in types" :key="item" :label="item" :value="item">
                        </el-option></el-select>
                </el-form-item>
                <el-form-item label="Bravais Lattice" :label-width="formLabelWidth">
                    <el-select v-model="dialogSelectInfo.bravaisLatticeNames" multiple collapse-tags
                        placeholder="select Bravais lattice" @change="bravaisLatticeChange">
                        <el-option v-for="item in bravaisLatticeInfoList" :key="item.name" :label="item.info"
                            :value="item.name">
                            <span style="float: left; color: #8492a6; font-size: 13px">{{ item.info }}</span>
                        </el-option></el-select>
                </el-form-item>
                <el-form-item>
                    <el-table :data="fittedMSGInfos" highlight-current-row @current-change="handleCurrentChange"
                        height="250">
                        <el-table-column prop="groupName" label="BNS Notation">
                        </el-table-column>
                        <el-table-column prop="groupType" label="Group Type"></el-table-column>
                        <el-table-column label="Bravais Lattice">
                            <template slot-scope="scope">
                                <el-tooltip effect="dark" placement="top">
                                    <div slot="content">{{ scope.row.bravaisLattice.info }}</div>
                                    <math-jax-view :latex="scope.row.bravaisLattice.name"></math-jax-view>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mpgName" label="MPG">
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import msgInfoList from "@/static/msgInfoList.json"
import bravaisLatticeInfoList from "@/static/bravaisLatticeInfoList.json"
import mpgNameList from "@/static/mpgNameList.json"
import MathJaxView from "@/utils/MathJaxView.vue";
import request from "@/js/request";

export default ({
    name: "MSGSelectDialog",
    components: { MathJaxView },
    setup() {

    },
    data() {
        return {
            dialogSelectVisible: false,
            fittedMSGTableVisible: false,
            formLabelWidth: '200px',
            types: ["I", "II", "III", "IV"],
            bravaisLatticeInfoList: bravaisLatticeInfoList,
            mpgNameList: mpgNameList,
            dialogSelectInfo: {
                groupTypes: [],
                bravaisLatticeNames: []
            },
            fittedMSGInfos: [],
            selectedMSGInfo: {
                groupName: "",
                groupType: "",
                mpgName: "",
                bravaisLattice: {
                    name: "",
                    info: ""
                }
            },
            msg: {}
        }
    },
    methods: {
        groupTypeChange() {
            this.filter();
        },
        bravaisLatticeChange() {
            this.filter();
        },
        filter() {
            this.fittedMSGInfos = [];
            for (let i = 0; i < msgInfoList.length; i++) {
                if (this.dialogSelectInfo.groupTypes.indexOf(msgInfoList[i].groupType) !== -1 &&
                    this.dialogSelectInfo.bravaisLatticeNames.indexOf(msgInfoList[i].bravaisLattice.name) !== -1) {
                    this.fittedMSGInfos.push(msgInfoList[i]);
                }
            }
        },
        handleCurrentChange(val) {
            if (this.selectedMSGInfo.groupName == val.groupName && this.msg != {}) {
                return;
            }
            this.selectedMSGInfo.groupName = val.groupName;
            this.selectedMSGInfo.groupType = val.groupType;
            this.selectedMSGInfo.bravaisLattice.name = val.bravaisLattice.name;
            this.selectedMSGInfo.bravaisLattice.info = val.bravaisLattice.info;
            this.selectedMSGInfo.mpgName = val.mpgName;
            request
                .get("/getMSGByGroupName?groupName=" + this.selectedMSGInfo.groupName)
                .then((result) => {
                    this.msg = result.data;
                    this.$emit('selectMSG', this.msg);
                }).catch(error => {
                    console.log(error);
                });
            this.dialogSelectVisible = false;
        }
    }
})
</script>

<style></style>