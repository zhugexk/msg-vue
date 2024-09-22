<template>
    <el-form label-width="250">
        <el-form-item label="Select magnetic space group type" label-width="250px">
            <el-select v-model="selectInfo.type" @change="groupTypeChange" placeholder="please select type">
                <el-option v-for="item in type2IdList" :key="item.type" :label="item.type" :value="item.type">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Select magnetic space group" label-width="250px">
            <el-select v-model="selectInfo.id" filterable placeholder="please select id">
                <el-option v-for="item in idList" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onChooseMSG">choose</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import type2IdJson from "@/static/type2Id.json"
import request from "@/js/request";
export default ({
    name: "MSGSelect",
    setup() {

    },
    data() {
        return {
            idList: [],
            type2IdList: type2IdJson,
            selectInfo: {
                type: "",
                id: [],
            },
            msg: {}
        }
    },
    methods: {
        groupTypeChange(value) {
            for (let i = 0; i < 4; i++) {
                if (type2IdJson[i].type == value) {
                    this.idList = type2IdJson[i].idList;
                    return;
                }
            }
        },
        onChooseMSG() {
            if (this.msg.id != this.selectInfo.id) {
                request
                    .get("/getMSGByGroupName?groupName=" + this.selectInfo.id)
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
