<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import team from '@/data/team-data'
import collaboration from '@/data/team-collaboration'
</script>

<template>
  <h1>Meet the Undefined Team!</h1>
  <section class="about-team" v-for="(member, index) in team" :key="index">
    <Card :member="member">
      <template #header>
        <img class="team-member_img" :alt="member.imgAlt" :src="member.imgSrc" />
      </template>
      <template #title>{{ member.name }}</template>
      <template #subtitle>{{ member.role }}</template>
      <template #content>
        <p>{{ member.bio }}</p>
        <Divider />
        <h3>Contributions</h3>
        <ul v-for="(contribution, index) in member.contributions" :key="index">
          <li>{{ contribution }}</li>
        </ul>
      </template>
      <template #footer>
        <div>
          <Button
            as="a"
            label="GitHub Profile"
            variant="link"
            :href="member.git"
            target="_blank"
            rel="noopener"
          />
        </div>
      </template>
    </Card>
  </section>
  <section class="about-collaboration">
    <h2>Collaboration</h2>
    <p>
      It was an exciting journey into the world of the Vue framework and the PrimeVue UI library —
      both of which were completely new to us. But we didn’t just write code — we learned how to
      work as a team, make decisions together, and move forward toward a common goal.
    </p>
    <h3>During the project, we:</h3>
    <ul v-for="(item, index) in collaboration" :key="index">
      <li>{{ item }}</li>
    </ul>
    <p>
      This was more than just a technical project — it was an experience of growth, mutual support,
      and true team spirit.
    </p>
    <h3>We are Undefined, and this is just the beginning!</h3>
  </section>
  <section class="about-rs-school">
    <Button as="a" variant="link" href="https://rs.school/" target="_blank" rel="noopener">
      <img src="../assets/rs-slope-js.webp" alt="RS School" style="height: 10em" />
    </Button>
    <h2>JavaScript/Front-end course (2024Q4)</h2>
  </section>
</template>

<style scoped>
h1 {
  margin-top: 1rem;
  font-size: 3rem;
  text-align: center;
  color: #ffffff;
}

.about-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  gap: 2rem;
}

.p-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}

.about-team :deep(.p-card-header) {
  max-width: 40%;
}

.team-member_img {
  width: 100%;
  height: auto;
  object-fit: cover;
  background: transparent;
}

.about-collaboration {
  h2,
  h3 {
    margin-top: 1rem;
    color: #ffffff;
  }
}

.about-rs-school {
  text-align: center;
  align-content: center;
}

@media (40rem < width < 64rem) {
  .about-team {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 2rem;
  }

  .p-card {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: flex-start;
    padding: 2rem;
  }

  .about-team :deep(.p-card-header) {
    flex: 0 0 25%;
  }

  .about-team :deep(.p-card-body) {
    flex: 1;
    padding: 0 0 0 5rem;
  }

  .team-member_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (width > 64rem) {
  .about-team {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: normal;
    flex-wrap: nowrap;
    gap: 2rem;
  }

  .p-card {
    flex-direction: column;
    max-width: 25rem;
  }

  .p-card-body {
    padding-left: 0;
  }

  .team-member_img {
    width: 100%;
    height: auto;
  }
}
</style>
