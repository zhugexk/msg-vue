<template>
  <div id="app">
    <el-header>
      <el-menu :default-active="this.$route.path" class="el-menu" mode="horizontal" router
        @select="handleSelect">
        <el-menu-item v-for="(item, i) in navList" :key="i" :index="item.name">
          <template slot="title">
            <span> {{ item.navItem }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
export default ({
  data() {
    return {
      navList: [
        {name: "/", navItem: "Home"},
        {name: "/msg", navItem: "MSG"},
        {name: "/material", navItem: "Material"},
        {name: "/achieve", navItem: "Achieve"},
      ]
    };
  },
  methods: {
    handleSelect(key,keyPath) {
      console.log(key,keyPath);
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>
