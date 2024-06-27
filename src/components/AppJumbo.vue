<script>
export default {
    name: 'AppJumbo'
}
</script>

<template>
    <section id="jumbotron">

        <img src="/img/suitecase.png" alt="suitcase" class="suitecase">
        <img src="/img/map.png" alt="map" class="map">


        <div class="presentation">
            <h1>Start your vacation with BnB</h1>
            <p>Where Comfort Meets Adventure!</p>
        </div>
    </section>
</template>



<style scoped>
#jumbotron {
    height: 600px;
    width: 100%;
    background-image: url('/img/jumbo.png');
    background-size: cover;
    background-position: center;
    position: relative;
    margin-top: -2rem;


    .suitecase {
        position: absolute;
        right: 0;
        top: 30%;
        transform: scale(0.8);
    }

    .map {
        position: absolute;
        left: 0;
        top: 10%;
        transform: scale(0.8);
    }

    .presentation {
        color: var(--bnb-lighter);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        h1 {
            font-size: 3rem;
            font-weight: bold;
        }

        p {
            font-size: 1.5rem;
        }
    }
}

@media (max-width: 1176px) {

    .suitecase,
    .map {
        display: none;
    }
}

@media (max-width: 768px) {
    #jumbotron {
        height: 400px;
    }

    .suitecase,
    .map {
        display: none;
    }

    .presentation h1 {
        font-size: 2rem;
    }

    .presentation p {
        font-size: 1.2rem;
    }
}

@media (max-width: 425px) {
    #jumbotron {
        height: 300px;
    }

    .presentation h1 {
        font-size: 2.5rem !important;
    }

    .presentation p {
        font-size: 1rem;
    }
}
</style>