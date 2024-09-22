<template>
    <el-container>
        <el-main>
            <MSGSelect @selectMSG="selectMSG"></MSGSelect>
            <el-row>
                <el-button type="primary" @click="getWPButtonClicked">get wyckoff position</el-button>
                <el-button type="primary" @click="getMPGButtonClicked">get magnetic point group</el-button>
            </el-row>
            <el-divider></el-divider>
            <wyckoff-position-table :wp="wp"></wyckoff-position-table>
            <!-- mpg -->
            <MPGDescription :mpg="mpg"></MPGDescription>

        </el-main>
    </el-container>
</template>

<script>
import MSGSelect from '@/component/MSGSelect.vue';
import requset from '@/js/request';
import WyckoffPositionTable from '@/component/WyckoffPositionTable.vue';
import MPGDescription from '@/component/MPGDescription.vue';
export default ({
    components: { MSGSelect, WyckoffPositionTable, MPGDescription },
    setup() {

    },
    data() {
        return {
            msg: {},
            wp: {},
            mpg: {},
        }
    },
    methods: {
        selectMSG(value) {
            this.msg = value;
        },
        getWPButtonClicked() {
            if (this.msg == null) {
                return
            }
            requset.get("/getWyckoffPositionById" + "?id=" + this.msg.id).then(result => {
                this.wp = result.data;
                console.log(this.wp);
            }).catch(error => {
                console.log(error);
            })
        },
        getMPGButtonClicked() {
            if (this.msg == null) {
                return
            }
            requset.get("/getMPGbyMSGId" + "?msgId=" + this.msg.id).then(result => {
                this.mpg = result.data;
            }).catch(error => {
                console.log(error);
            })
        }
    }
})
</script>
