<template>
    <div id="root">
        <PcLoginForm class="pc"></PcLoginForm>
        <MobileLoginForm class="mobile"></MobileLoginForm>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import PcLoginForm from "@/components/LoginForms/PcLoginForm.vue";
import MobileLoginForm from "@/components/LoginForms/MobileLoginForm.vue";

import axios from 'axios';

onMounted(() => {

})
</script>

<style scoped>
#root {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #94d0d8;
}

#root .pc {
    display: block;
}

#root .mobile {
    display: none;
}

@media (max-width: 768px) {
    #root {
        background-image: url(../assets/img/bg3_559x1191.jpg);
        background-repeat: no-repeat;
        background-position: top;
        background-size: cover;
        /* background-attachment: fixed; */
    }

    #root .pc {
        display: none;
    }

    #root .mobile {
        display: block;
    }
}
</style>