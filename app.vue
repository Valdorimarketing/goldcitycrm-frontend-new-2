<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Dark mode'u varsayılan olarak ayarla
onMounted(() => {
  // localStorage'da theme yoksa veya light ise dark yap
  const theme = localStorage.getItem('theme')
  if (!theme || theme === 'light') {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
})
</script>