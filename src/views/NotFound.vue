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
    display: flex;
    align-items: center;
    justify-content: center;

    .not_found {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
            filter: grayscale();
            height: 600px;
        }

        p {
            margin-bottom: 5rem;
            font-size: 2rem;
            color: var(--bnb-main);
        }

    }
}
</style>