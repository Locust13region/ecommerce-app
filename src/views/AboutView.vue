<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
</script>

<template>
  <h1>Meet the Undefined Team!</h1>
  <section class="about-team">
    <Card>
      <template #header>
        <img class="team-member_img" alt="Elizabeth" src="../assets/l.webp" />
      </template>
      <template #title>Elizaveta Abramova</template>
      <template #subtitle>Team lead, front-end developer </template>
      <template #content>
        <p class="">
          About a year ago I was an absolute novice. My current main goal is to become a good
          Frontend Developer. Excited to gain hands-on experience and continue growing as a
          developer within an team.
        </p>
        <Divider />
        <h3>Contributions</h3>
        <ul class="">
          <li>Created login page</li>
          <li>Created profile page</li>
          <li>Created cart page</li>
          <li>Implemented routing</li>
          <li>SCRUM master</li>
        </ul>
      </template>
      <template #footer>
        <div class="">
          <Button
            as="a"
            label="GitHub Profile"
            variant="link"
            href="https://github.com/ElizavetaAbramova"
            target="_blank"
            rel="noopener"
          />
        </div>
      </template>
    </Card>
    <Card>
      <template #header>
        <img class="team-member_img" alt="Roman" src="../assets/r.webp" />
      </template>
      <template #title>Roman Kargin</template>
      <template #subtitle>Front-end developer </template>
      <template #content>
        <p class="">
          About a year ago I was an absolute novice. My current main goal is to become a good
          Frontend Developer. Excited to gain hands-on experience and continue growing as a
          developer within an team.
        </p>
        <Divider />
        <h3>Contributions</h3>
        <ul class="">
          <li>Created signup page</li>
          <li>Created catalog page</li>
          <li>Implemented catalog sorting, filtering and searching</li>
          <li>Created main page</li>
        </ul>
      </template>
      <template #footer>
        <div class="">
          <Button
            as="a"
            label="GitHub Profile"
            variant="link"
            href="https://github.com/thefoku"
            target="_blank"
            rel="noopener"
          />
        </div>
      </template>
    </Card>
    <Card>
      <template #header>
        <img class="team-member_img" alt="Andrei" src="../assets/a.webp" />
      </template>
      <template #title>Andrei Maslennikov</template>
      <template #subtitle>Front-end developer </template>
      <template #content>
        <p class="">
          About a year ago I was an absolute novice. My current main goal is to become a good
          Frontend Developer. Excited to gain hands-on experience and continue growing as a
          developer within an team.
        </p>
        <Divider />
        <h3>Contributions</h3>
        <ul class="">
          <li>Implemented interaction with commercetools</li>
          <li>Created detailed product page</li>
          <li>Created about page</li>
          <li>Deploy project</li>
        </ul>
      </template>
      <template #footer>
        <div class="">
          <Button
            as="a"
            label="GitHub Profile"
            variant="link"
            href="https://github.com/Locust13region"
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
    <ul>
      <li>
        Got familiar with SCRUM principles — learning how to assign roles effectively, manage tasks,
        and track progress through sprints.
      </li>
      <li>
        Practiced high-quality code review — approaching every code change critically and
        thoughtfully, making our product more stable and clean.
      </li>
      <li>
        Communicated actively and supported each other — sharing ideas, discussing the best
        approaches, and offering valuable advice.
      </li>
      <li>
        Developed teamwork skills — learning to listen, compromise, and respect every team member’s
        opinion.
      </li>
      <li>
        Dived into new technologies — for all of us, this was the first time working with Vue,
        PrimeVue, and commercetools, and we tackled the challenges with confidence and unity.
      </li>
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
