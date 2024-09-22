<template>
  <div id="app">
    <nav align="center">
      <router-link to="/" >MSG</router-link> |
      <router-link to="/calTopo">Cal Topo | </router-link>
      <router-link to="/getkdotp">Get kdotp | </router-link>
      <router-link to="/getPairing">Get Pairing | </router-link>
      <router-link to="/test">Test</router-link>
      <!-- <router-link to="/about">About</router-link> -->
    </nav>
    <router-view/>
  </div>
</template>

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
