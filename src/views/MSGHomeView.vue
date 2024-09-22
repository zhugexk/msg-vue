<template>
  <el-container class="Test">
    <el-main>
      <MSGSelect @selectMSG="selectMSG"></MSGSelect>
      <el-descriptions v-if="isGetMSG" :column="4" title="Magnetic space group" direction="vertical" border>
        <el-descriptions-item label="Type">{{ msg.type }}</el-descriptions-item>
        <el-descriptions-item label="Group name">{{
          msg.groupName
        }}</el-descriptions-item>
        <!-- bravais lattice -->
        <el-descriptions-item label="T">
          <template>
            <el-popover trigger="hover" placement="top">
              <p>Basis vectors for conventional lattice:</p>
              <p>
                <math-jax-view
                  :latex="msg.bravaisLattice.conventionalBasicVectors.map((item, index) => { return `\\vec{a}_{${index + 1}}` + '=(' + item.toString() + ')' }).toString()"></math-jax-view>
              </p>
              <p>Basis vectors for primitive lattice:</p>
              <P>
                <math-jax-view
                  :latex="msg.bravaisLattice.primitiveBasicVectors.map((item, index) => { return `\\vec{t}_{${index + 1}}` + '=(' + item.toString() + ')' }).toString()"></math-jax-view>
              </P>
              <div slot="reference">
                <math-jax-view :latex="msg.bravaisLattice.name"></math-jax-view>
              </div>
            </el-popover>
          </template>
        </el-descriptions-item>
        <!-- G/T -->
        <el-descriptions-item label="G/T">
          <template>
            <el-popover trigger="hover" placement="top">
              <el-table :data="msg.operations" style="width:100%" max-height="400" border>
                <el-table-column label="operation" width="250">
                  <template slot-scope="scope">
                    <math-jax-view v-if="scope.row.isTimeInversal"
                      :latex="'\\Theta\\{' + scope.row.rotation + '|' + scope.row.translation.toString() + '\\}'"></math-jax-view>
                    <math-jax-view v-else
                      :latex="'\\{' + scope.row.rotation + '|' + scope.row.translation.toString() + '\\}'"></math-jax-view>
                  </template>
                </el-table-column>
                <el-table-column label="det" width="80">
                  <template slot-scope="scope">
                    <math-jax-view :latex="scope.row.pointGroupOperation.det.toString()"></math-jax-view>
                  </template>
                </el-table-column>
                <el-table-column label="rotation axis" width="250">
                  <template slot-scope="scope">
                    <math-jax-view :latex="'(' + scope.row.pointGroupOperation.axis.toString() + ')'"></math-jax-view>
                  </template>
                </el-table-column>
                <el-table-column label="rotation angle" width="150">
                  <template slot-scope="scope">
                    <math-jax-view :latex="scope.row.pointGroupOperation.angle"></math-jax-view>
                  </template>
                </el-table-column>
              </el-table>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">
                  Show all operations
                </el-tag>
              </div>
            </el-popover>
          </template>
        </el-descriptions-item>
      </el-descriptions>
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
import MathJaxView from "@/utils/MathJaxView.vue";
import HSPBNView from "@/component/HSPBNView.vue";
import TSubgroupTable from '@/component/TSubgroupTable.vue';
import AIVectorTable from '@/component/AIVectorTable.vue';
import MSGSelect from '@/component/MSGSelect.vue';
// import axios from "axios";
import request from "@/js/request";
import WyckoffPositionTable from "@/component/WyckoffPositionTable.vue";
import LittleGroupView from "@/component/LittleGroupView.vue";

export default {
  components: { MathJaxView, HSPBNView, TSubgroupTable, AIVectorTable, MSGSelect, WyckoffPositionTable, LittleGroupView },
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