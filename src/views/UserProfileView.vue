<script setup lang="ts">
import userProfileComponent from '../components/userProfile/user-profile-component.vue'
</script>

<template>
  <div class="profile">
    <h1>My profile</h1>
    <userProfileComponent></userProfileComponent>
  </div>
</template>

<style lang="css" scoped>
.profile {
  overflow: hidden;
  height: min-content;
}
@media (max-width: 380px) {
  .profile {
    width: 330px;
  }
}
</style>
