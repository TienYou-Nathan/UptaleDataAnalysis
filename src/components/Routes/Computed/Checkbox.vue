<template>
    <div class='entry_container'>
        <p class='entry_name'>{{name}}</p>
        <input class='entry_checkbox' type="checkbox" :checked="false" @click="$emit('check', $event.target.checked)" />
    </div>
</template>

<script>

export default {
    name : 'Checkbox',
    emits : ['check'],
    props : {
        name : {
            type : String,
            required : true
        },
    }
}
</script>

<style scoped>
.entry_container{
    background : #e2e2e2;
    margin: 2px 0px;
    padding:0px 4px;
    display : flex;
    justify-content: left;
    align-items: center;
    height :auto;
    width:15%;
}

.entry_name {
    margin-left : 5%;
}

.entry_checkbox {
    margin-left: auto;
}

</style>