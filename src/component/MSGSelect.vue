<template>
    <div>
        <el-row type="flex" class="row-bg">
            <el-col :span="6">
                <div class="grid-content">Select magnetic space group type</div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content"></div>Select Bravais lattice
            </el-col>
            <el-col :span="12">
                <div class="grid-content"></div>Select one magnetic space group name in the
                Belov-Neronova-Smirnova notation
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="6">
                <div class="grid-content"><el-select v-model="selectInfo.groupType" @change="groupTypeChange" placeholder="please select type">
            <el-option v-for="item in types" :key="item" :label="item" :value="item">
            </el-option>
        </el-select></div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content"></div><el-select v-model="selectInfo.bravaisLattice" @change="bravaisLatticeChange"
            placeholder="please select Bravais lattice">
            <el-option v-for="item in bravaisLatticeInfoList" :key="item.name" :label="item.info" :value="item.name">
                <span style="float: left; color: #8492a6; font-size: 13px">{{ item.info }}</span>
            </el-option>
        </el-select>
            </el-col>
            <el-col :span="12">
                <div class="grid-content"></div><el-select v-model="selectInfo.groupName" filterable placeholder="please select magentic space group">
            <el-option v-for="item in selectedMSGInfoList" :key="item.groupName" :label="item.groupName"
                :value="item.groupName">
                <span>{{ item.groupName + " ( magnetic point group: " + item.mpgName + ")" }}</span>
            </el-option>
        </el-select>
            </el-col>
        </el-row>
        <div slot="left footer"><el-button type="primary" @click="onChooseMSG">show concrete magnetic space group operations</el-button></div>
    </div>
</template>

<script>
// import type2IdJson from "@/static/type2Id.json"
import msgInfoList from "@/static/msgInfoList.json"
import bravaisLatticeInfoList from "@/static/bravaisLatticeInfoList.json"
import request from "@/js/request";

export default ({
    name: "MSGSelect",
    setup() {

    },
    data() {
        return {
            selectedMSGInfoList: [],
            types: ["Type I", "Type II", "Type III", "Type IV"],
            // msgInfoList: msgInfoList,
            bravaisLatticeInfoList: bravaisLatticeInfoList,
            selectInfo: {
                groupType: "",
                bravaisLattice: "",
                groupName: ""
            },
            msg: {}
        }
    },
    methods: {
        isSameGroupType(groupType, type) {
            return groupType == type.substring(5)
        },
        checkMSG(msgInfo, type, bravais) {
            return this.isSameGroupType(msgInfo.groupType, type) && msgInfo.bravaisLattice.name == bravais
        },
        refreshselectedMSGInfoList(type, bravais) {
            this.selectedMSGInfoList = [];
            for (let i = 0; i < msgInfoList.length; i++) {
                if (this.checkMSG(msgInfoList[i], type, bravais)) {
                    this.selectedMSGInfoList.push(msgInfoList[i]);
                }
            }
        },
        groupTypeChange() {
            this.refreshselectedMSGInfoList(this.selectInfo.groupType, this.selectInfo.bravaisLattice)
        },
        bravaisLatticeChange() {
            this.refreshselectedMSGInfoList(this.selectInfo.groupType, this.selectInfo.bravaisLattice)
        },
        onChooseMSG() {
            if (this.msg != {} && this.msg.groupName != this.selectInfo.groupName) {
                request
                    .get("/getMSGByGroupName?groupName=" + this.selectInfo.groupName)
                    .then((result) => {
                        this.msg = result.data;
                        this.$emit('selectMSG', this.msg);
                    }).catch(error => {
                        console.log(error);
                    });
            }
        }
    }
})
</script>

<style>
.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
    text-align: center;
}

.grid-content {
    border-radius: 4px;
    min-height: 0px;
}

.row-bg {
    padding: 10px 0;
}
</style>