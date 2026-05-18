---
title: 'Tablog: минималистичная тема для блога'
date: 2026-05-18
pinned: true
---

<script>
import config from '/src/config'
import Action from '$lib/components/Action.svelte'
import Button from '$lib/components/Button.svelte'
</script>

Перед вами мой блог на Tablog — минималистичной теме, где ничего лишнего не отвлекает от текста. Я собрал его так, чтобы писать и читать было спокойно: аккуратная вёрстка, тёмная тема, архив записей — всё под рукой.

Под капотом SvelteKit: сайт быстрый, лёгкий и понятный в доработке. Цвета, шрифты, контент в `/content` — настраивается под себя.

Если захотите такой же — тему можно скачать и развернуть у себя: поменять оформление, добавить свои посты и сделать блог полностью своим.

<Action>
    <Button href={config.themeUrl}>Скачать Tablog</Button>
</Action>
