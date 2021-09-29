<template>
    <div id=container>
        <svg id=viz>

        </svg>
    </div>
</template>

<script>

import * as d3 from "d3";
import { proxyToStructure } from "../../utilities";

export default {
  name: "PathVisualization",
  props: {
    data: Array
  }, 
  mounted(){
        console.log("mounted"); 
        let data = proxyToStructure(this.data).data;
        console.log(data);

        this.draw(data[0]);
  },
  methods : {
    draw(data){
        console.log('***Data To visualize***');
        console.log(data)

        const innerwidth=900;
        const innerheight=540;

        const xpadding=20;

        var margin = {top: 50, right: 150, bottom: 160, left: 50}
            , width = 900 + margin.left + margin.right  
            , height = innerheight + margin.top + margin.bottom; 

        const global_container = d3.select('#viz')
            .attr('width', `${width}px`)
            .attr('height', `${height}px`);

        // const xScale =
        // const yScale =
        // 5. X scale will use the index of our data
        let xScale = d3.scaleOrdinal()
            .domain(data.zones.map(e=>e.tag)) // input
            .range(data.zones.map((e,i)=>(innerwidth-(xpadding*2))*(i/(data.zones.length-1))+xpadding)); // output


        // 6. Y scale will use the randomly generate number 
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data.zones.map(e=>e.founded))]) // input 
            .range([innerheight, 0]); // output 

        // 7. d3's line generator
        const line = (param) => {
            return d3.line()
                .x(function(d) { return xScale(d.tag); }) // set the x values for the line generator
                .y(function(d) { return yScale(d[param]); }) // set the y values for the line generator 
                .curve(d3.curveMonotoneX)
        } 

        let innerContainer = global_container.append('rect')
            .attr("id", "innerContainer")
            .attr('x',margin.left)
            .attr('y',margin.top)
            .attr("width", innerwidth)
            .attr("height", innerheight)
            .attr("fill",'white');

        // 3. Call the x axis in a group tag
        global_container.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+ margin.left +"," + (innerheight + margin.top) +")")
            .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom
            .selectAll("text")
                .attr("transform", "translate(80,70)rotate(45)");

        // 4. Call the y axis in a group tag
        global_container.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+ margin.left +"," + margin.top +")")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

        // 12. Appends a circle for each datapoint 
        let dots = global_container.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

        dots.append("path")
            .datum(data.zones) // 10. Binds data to the line 
            .attr("class", "line founded") // Assign a class for styling 
            .attr("d", line('founded')); // 11. Calls the line generator 

        dots.append('g').selectAll(".dot.founded")
            .data(data.zones)
            .join("circle") // Uses the enter().append() method
                .attr("class", "dot founded") // Assign a class for styling
                .attr("cx", function(d) { return xScale(d.tag) })
                .attr("cy", function(d) { return yScale(d.founded) })
                .attr("r", 10)
                .on('mouseover',e => {
                    const d = e.originalTarget.__data__;
                    this.highlightDot(dots,xScale(d.tag),yScale(d.founded),xScale(d.tag),innerheight-yScale(d.founded))
                })
                .on('mouseout',() => this.destroyElements(dots,'.dashed_line'))

        dots.append("path")
            .datum(data.zones) // 10. Binds data to the line 
            .attr("class", "line scored") // Assign a class for styling 
            .attr("d", line("scored")); // 11. Calls the line generator 

        dots.append('g').selectAll(".dot.scored")
            .data(data.zones)
            .join("circle") // Uses the enter().append() method
                .attr("class", "dot scored") // Assign a class for styling
                .attr("cx", function(d) { return xScale(d.tag) })
                .attr("cy", function(d) { return yScale(d.scored) })
                .attr("r", 10)
                .on('mouseover',e => {
                    const d = e.originalTarget.__data__;
                    this.highlightDot(dots,xScale(d.tag),yScale(d.scored),xScale(d.tag),innerheight-yScale(d.scored))
                })
                .on('mouseout',() => this.destroyElements(dots,'.dashed_line'))
    },

    highlightDot(container, x, y, w, h){
        this.drawDashedLine(container, {x:x-w,y:y}, {x:x,y:y})
        this.drawDashedLine(container, {x:x,y:y+h}, {x:x,y:y})
    },

    drawDashedLine(container, p1, p2){
        p1.x=p1.x==undefined?0:p1.x;
        p1.y=p1.y==undefined?0:p1.y;
        p2.x=p2.x==undefined?0:p2.x;
        p2.y=p2.y==undefined?0:p2.y;
        container.append('line')
            .attr('class', 'dashed_line')
            .attr('x1', p1.x)
            .attr('y1', p1.y)
            .attr('x2', p2.x)
            .attr('y2', p2.y)
            .attr('stroke', 'black')
            .attr('stroke-width', 3)
            .attr("stroke-dasharray","16, 4")       
    },

    destroyElements(container, selector){
        container.selectAll(selector).remove();
    }
  }
};
</script>

<style>

#viz{
    background-color: rgb(207, 207, 207);
}

#innerContainer{
    fill: white;
}

.line {
    fill: none;
    stroke-width: 3;
}

.dot {
    stroke: #fff;
}

.dot.founded{
    fill: #ffab00; 
}

.line.founded{
    stroke: #ffab00;
}
.dot.scored{
    fill: #2a7eeb; 
}

.line.scored{
    stroke: #2a7eeb;
}

</style>