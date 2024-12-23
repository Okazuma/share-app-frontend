<template>
  <div>
    <!-- ヘッダー -->
    <header>
      <nav>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/about">About</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <!-- メインコンテンツ部分 -->
    <main>
      <slot />
    </main>

    <!-- フッター -->
    <footer>
      <p>&copy; 2024 My Nuxt App</p>
    </footer>
  </div>
</template>

<script setup>
// 特に追加するロジックがあればここに記述
</script>

<style scoped>
/* ヘッダーのスタイル */
header {
  background-color: #333;
  padding: 1rem;
  color: white;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

nav a,
nav a:visited {
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

/* メインコンテンツ */
main {
  padding: 2rem;
}

/* フッターのスタイル */
footer {
  text-align: center;
  padding: 1rem;
  background-color: #f0f0f0;
  position: relative;
  bottom: 0;
  width: 100%;
}
</style>
