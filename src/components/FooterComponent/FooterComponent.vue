<template>
  <footer>
    <div class="footer-container">
      <a class="footer-rs-logo" href="https://rs.school/" target="_blank">
        <img src="@/assets/rss-logo.png" alt="RS School Logo" />
      </a>
      <div class="footer-team">
        <RouterLink :to="'/about'" class="footer-team-link">Undefined team</RouterLink>
        <ul class="footer-team-list">
          <li class="footer-team-item">
            <a href="https://github.com/ElizavetaAbramova" target="_blank">Liza</a>
          </li>
          <li class="footer-team-item">
            <a href="https://github.com/Locust13region" target="_blank">Andrey</a>
          </li>
          <li class="footer-team-item">
            <a href="https://github.com/thefoku" target="_blank">Roma</a>
          </li>
        </ul>
      </div>
      <div class="footer-year">
        <span>2025</span>
      </div>
    </div>
  </footer>
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
  font-size: 1.2em;
}
.footer-team-list {
  list-style: none;
  margin: 0px;
  padding: 0px;
  display: flex;
  gap: 20px;
}
.footer-team-link,
.footer-team-item a {
  border-radius: 5px;
}
.footer-year {
  font-size: 1.2em;
}
</style>
