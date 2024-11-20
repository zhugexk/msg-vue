<template>
  <el-container class="Home">
    <el-main>
      <MSGSelectDialog @selectMSG="selectMSG"></MSGSelectDialog>
      <MSGDescription v-if="isGetMSG" style="margin-bottom: 20px" :msg="msg"></MSGDescription>
      <el-divider></el-divider>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="margin-top: 20px">
        <el-tab-pane label="High Symmetry Point Band Node" name="hspbn">
          <HSPBNView v-if="isGetMSG && (hspbn != null) && (activeName == 'hspbn')" :hspbn="hspbn"></HSPBNView>
        </el-tab-pane>
        <el-tab-pane label="Atomic Insulator Basis" name="aiBasis">
          <el-radio-group v-model="repType" v-if="isGetMSG && (activeName == 'aiBasis')" style="margin-top: 20px" border>
            <el-radio label="single valued">single valued</el-radio>
            <el-radio label="double valued">double valued</el-radio>
          </el-radio-group>
          <AIVectorTable style="margin-top: 20px" v-if="isGetMSG && (activeName == 'aiBasis')"
            title="Atomic Insulator Basis" :AIVector="msg.aiBases" :repType="repType">
          </AIVectorTable>
        </el-tab-pane>
        <el-tab-pane label="Wyckoff Position" name="wyckoffPosition">
          <wyckoff-position-table style="margin-top: 20px"
            v-if="isGetMSG && (wpList != null) && (activeName == 'wyckoffPosition')"
            :wpList="wpList"></wyckoff-position-table>
        </el-tab-pane>
        <el-tab-pane label="T-subgroup" name="tsubgourps">
          <t-subgroup-table style="margin-top: 20px" v-if="isGetMSG && (tsubgroups != null) && activeName == 'tsubgourps'"
            :tsubgroups="tsubgroups"></t-subgroup-table>
        </el-tab-pane>
        <el-tab-pane label="Little Group" name="littlegroup">
          <LittleGroupView style="margin-top: 20px"
            v-if="isGetMSG && (littlegroups != null) && activeName == 'littlegroup'" :littlegroups="littlegroups">
          </LittleGroupView>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import type2Idjson from "../../src/static/type2Id.json";
import HSPBNView from "@/component/HSPBNView.vue";
import TSubgroupTable from '@/component/TSubgroupTable.vue';
import AIVectorTable from '@/component/AIVectorTable.vue';
import request from "@/js/request";
import WyckoffPositionTable from "@/component/WyckoffPositionTable.vue";
import LittleGroupView from "@/component/LittleGroupView.vue";
import MSGDescription from "@/component/MSGDescription.vue";
import MSGSelectDialog from "@/component/MSGSelectDialog.vue";

export default {
  components: { HSPBNView, TSubgroupTable, AIVectorTable, WyckoffPositionTable, LittleGroupView, MSGDescription, MSGSelectDialog },
  setup() { },

  data() {
    return {
      idList: [],
      type2IdList: type2Idjson,
      msg: {},
      hspbn: {},
      tsubgroups: {},
      wpList: {},
      littlegroups: {},
      isGetMSG: false,
      repType: "single valued",
      repName: "",
      activeName: ""
    };
  },
  methods: {
    selectMSG(value) {
      this.activeName = "";
      this.msg = value;
      this.isGetMSG = true;
      console.log(this.msg);

    },
    getHSPBN(id) {
      request.get("/getHSPBNbyId" + "?id=" + id).then(result => {
        this.hspbn = result.data;
        console.log(this.hspbn);
      }).catch(error => {
        console.log(error);
      })
    },
    getTSubgroups(id) {
      request.get("/getTSubgroupById" + "?id=" + id).then(result => {
        this.tsubgroups = result.data;
        console.log(this.tsubgroups);
      }).catch(error => {
        console.log(error);
      })
    },
    getWyckoffPosition(id) {
      request.get("/getWyckoffPositionById" + "?id=" + id).then(result => {
        this.wpList = result.data;
        console.log(this.wpList);
      }).catch(error => {
        console.log(error);
      })
    },
    getLittleGroups(id) {
      request.get("/getAllLittleGroupsByMSGId" + "?msgId=" + id).then(result => {
        this.littlegroups = result.data;
        console.log(this.littlegroups);
      }).catch(error => {
        console.log(error);
      })
    },
    handleClick(tab) {
      console.log(tab.name);
    }
  },
  watch: {
    msg() {
      if (this.wpList.id != this.msg.id) {
        this.getWyckoffPosition(this.msg.id);
      }
      if (this.tsubgroups.id != this.msg.id) {
        this.getTSubgroups(this.msg.id);
      }
      if (this.hspbn.id != this.hspbn) {
        this.getHSPBN(this.msg.id);
      }
      this.getLittleGroups(this.msg.id);
    }
  }
};
</script>