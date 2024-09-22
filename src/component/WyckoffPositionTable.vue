<template>
    <div>
        <el-table :data="wpList.wpList" v-if="wpList.wpList != null" highlight-current-row
            @current-change="handleCurrentChange" style="width:100%" max-height="600" border>
            <el-table-column label="letter" align="center">
                <template slot-scope="scope">
                    <math-jax-view :latex="scope.row.letter"></math-jax-view>
                </template>
            </el-table-column>
            <el-table-column label="Position and magnetic moment" align="center">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" width="800">
                        <el-table :data="scope.row.positions" style="width:100%" max-height="400" border>
                            <el-table-column label="Position and magnetic moment" align="center">
                                <template slot-scope="scope">
                                    <math-jax-view
                                        :latex="'\\{' + scope.row.position.toString() + '|' + scope.row.spin.toString() + '\\}'"></math-jax-view>
                                </template>
                            </el-table-column>
                            <el-table-column label="operation" align="center">
                                <template slot-scope="scope">
                                    <math-jax-view v-if="scope.row.operation.isTimeInversal"
                                        :latex="'\\Theta' + '\\{' + scope.row.operation.rotation + '|' + scope.row.operation.translation + '\\}'"></math-jax-view>
                                    <math-jax-view v-else
                                        :latex="'\\{' + scope.row.operation.rotation + '|' + scope.row.operation.translation + '\\}'"></math-jax-view>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div slot="reference" class="name-wrapper">
                            <math-jax-view
                                :latex="'\\{' + scope.row.positions[0].position.toString() + '|' + scope.row.positions[0].spin.toString() + '\\}'"></math-jax-view>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="Site symmetry" align="center">
                <template slot-scope="scope">
                    <math-jax-view :latex="scope.row.siteSymmetryGroup.name"></math-jax-view>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="isShowSiteDetails">
            <MPGDescription v-if="this.siteSymmetryGroup != null" :mpg="siteSymmetryGroup" title="Site Symmetry Group"
                style="margin-top: 20px"></MPGDescription>
            <el-radio-group v-model="repType" style="margin-top: 20px" border>
                <el-radio label="single valued">single valued</el-radio>
                <el-radio label="double valued">double valued</el-radio>
            </el-radio-group>
            <AIVectorTable style="margin-top: 20px" v-if="isShowSiteDetails && aiVector != null"
                title="Atomic Insulator Vectors" :AIVector="aiVector" :repType="repType" :vectorNames="vectorNames">
            </AIVectorTable>
            <content-reduce-table :repType="repType" :contentReduces="contentReduces"></content-reduce-table>
        </div>
        <div v-if="aiReduces != null">
            <el-dropdown @command="handleCommandForWPNameList">
                <span class="el-dropdown-link">
                    <math-jax-view :latex="selectedWPName"></math-jax-view>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="wpName in wpNameList" :command="wpName" :key="wpName">
                        <math-jax-view :latex="wpName"></math-jax-view>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommandForHSPNameList">
                <span class="el-dropdown-link">
                    <math-jax-view :latex="selectedHSPName"></math-jax-view>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="hspName in hspNameList" :command="hspName" :key="hspName">
                        <math-jax-view :latex="hspName"></math-jax-view>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleSiteSymRepNameChange">
                <span class="el-dropdown-link">
                    <math-jax-view :latex="selectedSiteSymName"></math-jax-view>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="siteSymRepName in siteSymRepNameList" :command="siteSymRepName" :key="siteSymRepName">
                        <math-jax-view :latex="siteSymRepName"></math-jax-view>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-radio-group v-model="repType">
                <el-radio label="single valued">single valued</el-radio>
                <el-radio label="double valued">double valued</el-radio>
            </el-radio-group>
            <el-table :data="selectedAIReduce.reduceMat" max-height="800" border>
                <el-table-column width="200" fixed>
                    <template slot-scope="aiBasesScope">
                        <math-jax-view :latex="selectedAIReduce.aibases[aiBasesScope.$index]"></math-jax-view>
                    </template>
                </el-table-column>
                <el-table-column width="200" v-for="(item, i) in selectedAIReduce.hspBases" :key="i" align="center">
                    <template slot="header">
                        <math-jax-view :latex="item"></math-jax-view>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row[i] }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import MathJaxView from '@/utils/MathJaxView.vue';
import MPGDescription from './MPGDescription.vue';
import request from '@/js/request';
import AIVectorTable from './AIVectorTable.vue';
import ContentReduceTable from './ContentReduceTable.vue';
export default ({
    components: { MathJaxView, MPGDescription, AIVectorTable, ContentReduceTable },
    props: ["wpList"],
    setup() {

    },
    data() {
        return {
            siteSymmetryGroup: {},
            aiVector: [],
            vectorNames: [],
            contentReduces: [],
            selectIndex: 0,
            repType: "single valued",
            isShowSiteDetails: false,
            aiReduces: [],
            wpNameList: [],
            hspNameList: [],
            siteSymRepNameList: [],
            selectedWPName: "",
            selectedHSPName: "",
            selectedSiteSymName: "",
            selectedAIReduce: {},
        }
    },
    mounted() {
        this.getAIReduces(this.wpList.id);
    },
    methods: {
        getSiteSymmetryGroup(id) {
            request.get("/getMPGById?id=" + id).
                then(result => {
                    this.isShowSiteDetails = false;
                    this.siteSymmetryGroup = result.data;
                    this.getVectorNames();
                    this.getReduceExpression();
                    this.getOrbitalReduces();
                    this.isShowSiteDetails = true;
                }).catch(error => {
                    console.log(error);
                })
        },
        getAIReduces(id) {
            request.get("/getAIReducesbymsgId?id=" + id).
                then(result => {
                    this.aiReduces = result.data;
                    let unique = (arr) => {
                        let seen = new Map();
                        return arr.filter((item) => {
                            return !seen.has(item) && seen.set(item, 1);
                        });
                    };
                    this.wpNameList = unique(this.aiReduces.map(item => { return item.wpName }));
                    this.hspNameList = unique(this.aiReduces.map(item => { return item.hspName }));
                    this.siteSymRepNameList = unique(this.aiReduces.map(item => {return item.siteSymRepName}));
                    this.selectedWPName = this.wpNameList[0];
                    this.selectedHSPName = this.hspNameList[0];
                    this.selectedAIReduce = this.aiReduces[0];
                    this.selectedSiteSymName = this.siteSymRepNameList[0];
                }).catch(error => {
                    console.log(error);
                })
        },
        getOrbitalReduces() {
            // console.log(this.contentReduces.length);
            // console.log(this.siteSymmetryGroup.orbitalReduces.length);
            // console.log(this.contentReduces.map((item)=>{return item.content}));
            // console.log(this.siteSymmetryGroup.orbitalReduces.map((item)=>{return item.orbitalName}));
            for (let i = 0; i < this.siteSymmetryGroup.orbitalReduces.length; i++) {
                this.siteSymmetryGroup.orbitalReduces[i].repBases = []
                for (let j = 0; j < this.siteSymmetryGroup.orbitalReduces[i].repInfo.length; j++) {
                    this.siteSymmetryGroup.orbitalReduces[i].repBases[j] = '|' + this.siteSymmetryGroup.orbitalReduces[i].repInfo[j].repName + ',' +
                        this.siteSymmetryGroup.orbitalReduces[i].repInfo[j].repBasisIndex + '\\rangle'
                        + '^{' + this.siteSymmetryGroup.orbitalReduces[i].repInfo[j].repIndex + '}';
                }
                let index = this.contentReduces.map((item) => { return item.content }).findIndex(((item) => item == this.siteSymmetryGroup.orbitalReduces[i].orbitalName));
                this.contentReduces[index].orbitalReduce = this.siteSymmetryGroup.orbitalReduces[i];
            }
        },
        getReduceExpression() {
            for (let i = 0; i < this.contentReduces.length; i++) {
                this.contentReduces[i].reduceExpression = this.contentReduces[i].reduce.map((item, j) => {
                    if (item == 1) return this.vectorNames.filter(data => data.type == this.contentReduces[i].type)[j].name;
                    else if (item == 0) return;
                    else return `${item}${this.vectorNames.filter(data => data.type == this.contentReduces[i].type)[j].name}`
                }).filter(data => data != null).join("+");
            }
        },
        getVectorNames() {
            this.vectorNames = [];
            for (let i = 0; i < this.siteSymmetryGroup.representations.length; i++) {
                this.vectorNames.push({
                    name: `\\vec{a}_{${this.wpList.wpList[this.selectIndex].letter}}^{${this.siteSymmetryGroup.representations[i].name}}`,
                    type: this.siteSymmetryGroup.representations[i].type
                });

            }
        },
        handleCurrentChange(currentRow, oldRow) {
            if (currentRow != oldRow) {
                this.isShowSiteDetails = false;
                this.selectIndex = this.wpList.wpList.findIndex((row) => row == currentRow);
                this.getSiteSymmetryGroup(this.wpList.wpList[this.selectIndex].siteSymmetryGroup.id);
                this.aiVector = this.wpList.wpList[this.selectIndex].aiVector;
                this.contentReduces = this.wpList.wpList[this.selectIndex].contentReduces;
            }
        },
        handleCommandForWPNameList(command) {
            this.selectedWPName = command;
            this.getSelectedAIReduce();
        },
        handleCommandForHSPNameList(command) {
            this.selectedHSPName = command;
            this.getSelectedAIReduce();
        },
        handleRepTypeChange() {
            this.getSelectedAIReduce();
        },
        handleSiteSymRepNameChange(command) {
            this.selectedSiteSymName = command;
            this.getSelectedAIReduce();
        },
        getSelectedAIReduce() {
            for (let i = 0; i < this.aiReduces.length; i++) {
                if (this.aiReduces[i].wpName == this.selectedWPName
                && this.aiReduces[i].hspName == this.selectedHSPName
                && this.aiReduces[i].repType == this.repType
                && this.aiReduces[i].siteSymRepName == this.selectedSiteSymName) {
                    this.selectedAIReduce = this.aiReduces[i];
                    return true;
                }
            }
            console.log("can't find")
            return false;
        }
    }
})
</script>
