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

        @media(max-width: 768px) {
            width: 70%;
            text-align: center;
        }

        img {
            filter: grayscale();
            height: 600px;

            @media(max-width:768px) {
                height: 100%;
                max-width: 100%;
            }
        }

        p {
            margin-bottom: 5rem;
            font-size: 2rem;
            color: var(--bnb-main);

            @media(max-width: 768px) {
                font-size: 1.5rem;
            }
        }

    }
}
</style>