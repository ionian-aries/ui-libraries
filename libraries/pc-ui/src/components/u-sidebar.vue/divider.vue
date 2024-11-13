<template>
<div :class="$style.root"></div>
</template>

<script>
export default { name: 'u-sidebar-divider' };
</script>

<style module>
.root {
    margin: var(--sidebar-divider-margin-y) 0;
    border-bottom: var(--sidebar-divider-height) solid var(--sidebar-divider-background);
}
</style>
