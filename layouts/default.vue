<template>
  <div>
    <VmHeader></VmHeader>
    <main>
      <nuxt />
      <VmLoginModal></VmLoginModal>
      <VmCheckoutModal></VmCheckoutModal>
    </main>
    <VmFooter></VmFooter>
  </div>
</template>

<script>
import VmHeader from "@/components/header/Header";
import VmFooter from "@/components/footer/Footer";
import VmLoginModal from "@/components/modal/Login";
import VmCheckoutModal from "@/components/modal/Checkout";

export default {
  components: {
    VmHeader,
    VmFooter,
    VmLoginModal,
    VmCheckoutModal
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
