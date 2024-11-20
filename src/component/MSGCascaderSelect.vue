<template>
    <div class="block">
        <span class="demonstration" style="font-size: xx-small;">Select Magnetic space group(MSG) with Type/Magnetic
            point group(MPG)/Belov-Neronova-Smirnova(BNS) notation</span>
        <el-cascader v-model="selectInfo" :options="options" filterable></el-cascader>
        <el-button @click="onChooseMSG">chose</el-button>
    </div>
</template>

<script>
import msgInfoList from "@/static/msgInfoList.json"
import bravaisLatticeInfoList from "@/static/bravaisLatticeInfoList.json"
// import mpgNameList from "@/static/mpgNameList.json"
import request from "@/js/request";

export default ({
    name: "MSGCascaderSelect",
    setup() {

    },
    data() {
        return {
            options: [],
            selectedMSGInfoList: [],

            selectInfo: {
                groupType: "",
                bravaisLattice: "",
                mpgName: "",
                groupName: ""
            },
            msg: {}
        }
    },
    methods: {
        getOptions() {
            let types = ["I", "II", "III", "IV"];
            for (let i = 0; i < types.length; i++) {
                this.options[i] = {value: "", label: "", children: []}
                this.options[i].value = types[i];
                this.options[i].label = types[i];
                this.options[i].children = [];
                for (let j = 0; j < bravaisLatticeInfoList.length; j++) {
                    this.options[i].children[j] = {value: "", label: "", children: []}
                    this.options[i].children[j].value = bravaisLatticeInfoList[j].name;
                    this.options[i].children[j].label = bravaisLatticeInfoList[j].info;
                    this.options[i].children[j].children = []
                }
            }
            for(let i = 0; i < msgInfoList.length; i ++) {
                let type = msgInfoList[i].groupType;
                let bravaisLattice = msgInfoList[i].bravaisLattice;
                let groupName = msgInfoList[i].groupName;
                for (let j = 0; j < this.options.length; j ++) {
                    let optionType = this.options[j].value;
                    for (let k = 0; k < this.options[j].children.length; k ++) {
                        let optionBravaisLatticeName = this.options[j].children[k].value
                        if (bravaisLattice.name == optionBravaisLatticeName && type == optionType) {
                            this.options[j].children[k].children.push({
                                value: groupName,
                                label: groupName
                            })
                        }
                    }
                }
            }
            console.log(this.options);
        },
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
            if (this.msg.groupName != this.selectInfo.groupName) {
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
    },
    created() {
        this.getOptions();
    }
})
</script>
