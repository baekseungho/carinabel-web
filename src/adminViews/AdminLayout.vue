<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="adminLayout">
    <AdminSidebar />
    <div class="adminMain">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
</script>

<style scoped>
.adminLayout {
  display: flex;
  min-height: 100vh;
}

.adminMain {
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
  overflow: auto;
}
</style>
