<!--组件：latex转换成math表示
输入：
  latex：string
输出：
  无，仅展示数学公式
使用案例：
  <TheLatex2Math :latex="mathForm.sdOutput"/>
-->
<template>
  <div class="latexDiv" v-html="'$$' + latex + '$$'" />
</template>
   
<script>
import MathJax from '@/js/MathJax'
export default {
  name: 'MathJaxView',
  props: { latex: { type: String } }, // 限制父子组件参数为String
  created() { // 组件刚创建的时候，watch并不会被触发，因为latex值没发生变化
    this.mathJax()
  },
  watch: { // 监视latex的变化
    latex() {
      this.mathJax()
    }
  },
  methods: {
    mathJax() {
      this.$nextTick(function () { // Vue的DOM渲染是异步的
        if (MathJax.isMathjaxConfig) { // 是否配置MathJax
          MathJax.initMathjaxConfig()
        }
        MathJax.MathQueue('latexDiv') // 渲染对应的id/class
      })
    }
  }
}
</script>