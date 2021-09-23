<template>
    <div>
        <label for="general_input">Select general file here</label>
        <input type="file" id="general_input" name="general_input" accept=".csv">
        <label for="detail_input">Select detail file here</label>
        <input type="file" id="detail_input" name="detail_input" accept=".csv">
    </div>
    <button id=start v-on:click='startAnalysis()'>Start Analysis</button>
</template>

<script>
export default {
    name : 'FileLoader',
    emits : ['filesLoaded'],
    methods: {
        load_file : async function (file) {
            function readFileAsync(file) {
                return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = reject;
                    reader.readAsText(file);
                })
            }

            let data;
            try {
                let contentBuffer = await readFileAsync(file);
                data = d3.csvParse(contentBuffer, d3.autoType); // see https://github.com/d3/d3-dsv#autoType
            } catch(err) {
                console.log(err);
            }

            return data;
        },
        startAnalysis : async function(){
            const general = document.getElementById('general_input').files[0];
            const detail = document.getElementById('detail_input').files[0];

            this.$emit('filesLoaded', {
                general : general!=undefined?await this.load_file(general):await d3.csv('/general.csv'), 
                detail : detail!=undefined?await this.load_file(detail):await d3.csv('/detail.csv')
            });
        },
    }
}
</script>

<style scoped>

</style>