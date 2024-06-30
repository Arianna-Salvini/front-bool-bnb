<script>
export default {
    name: 'NotFound'
}
</script>

<template>
    <div class="container">
        <div class="not_found">
            <img src="/img/no-apartments-illustration.png" alt="">
            <p>No apartment found, sorry...</p>
        </div>
    </div>

</template>



<style scoped>
.container {
    height: calc(100vh - 265px);

    .not_found {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
            filter: grayscale();
        }

        p {
            margin-bottom: 5rem;
            font-size: 2rem;
            color: var(--bnb-main);
        }

    }
}
</style>