<template>
    <div class='LegendContainer'>
        <div :key='entry.id' v-for="entry in categories">
            <LegendEntry @check="entrychecked" :entry='entry'/>
        </div>
    </div>
</template>

<script>
import LegendEntry from './LegendEntry.vue';

export default {
    name : 'Legend',
    emits : ['check'],
    components : {
        LegendEntry,
    },
    props : {
        categories : {
            type : Array,
            required : true
        },
    },methods : {
        entrychecked(e){
            this.$emit('check', e)
        }
    }
}
</script>

<style scoped>
.LegendContainer {
    margin: 5px;
    padding: 5px 5px;
    width:15%;
    height:auto;
}
</style>