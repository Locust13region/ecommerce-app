<template>
  <v-footer>
    <div class="footer-container">
      <a class="footer-rs-logo" href="https://rs.school/">
        <img src="@/assets/rss-logo.png" alt="RS School Logo" />
      </a>
      <div class="footer-team">
        <span>Undefined team</span>
        <ul class="footer-team-list">
          <li><a href="https://github.com/ElizavetaAbramova">Liza</a></li>
          <li><a href="https://github.com/Locust13region">Andrey</a></li>
          <li><a href="https://github.com/thefoku">Roma</a></li>
        </ul>
      </div>
      <div class="footer-year">
        <span>2025</span>
      </div>
    </div>
  </v-footer>
</template>

<style scoped>
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-top: 20px;
}
.footer-rs-logo {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-team {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
}
.footer-team-list {
  list-style: none;
  margin: 0px;
  padding: 0px;
  display: flex;
  gap: 10px;
}
</style>
