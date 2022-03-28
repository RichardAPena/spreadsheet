console.log(d3)

spreadArray = [
    ["SID", "Asmt 1", "Asmt 2", "Asmt 3", "Midterm", "FinalExam"],
    [1000001, 92.0, 80.0, 100.0, 62.5, 81.5],
    [1000002, 100.0, 85.5, 90.0, 75.0, 90.25],
    [1000003, 80.0, 90.5, 90.0, 66.5, 68.0],
    [1000004, 100.0, 100.0, 100.0, 98.0, 95.5],
    [1000005, 100.0, 90.0, 100.0, 58.5, 72.0],
    [1000006, 90.5, 81.5, 95.5, 65.5, 64.0],
    [1000007, 40.5, 50.5, 65.5, 22.5, 51.0],
    [1000008, 70.0, 75.0, 70.0, 55.5, 21.0],
    [1000009, 80.0, 82.5, 65.0, 72.5, 88.0]  
]

gradesData = [
    {"grade": "A", "frequency": 1}
]

function generateTable(table, data) {
    for (let i=0; i<data.length; i++) {
        let row = table.insertRow()
        for (let j=0; j<data[i].length; j++) {
            let cell = row.insertCell()
            let text = document.createTextNode(data[i][j])
            if (i == 0) {
                cell.classList.add("columnHeader")
                cell.setAttribute("id", "column-"+j)
            }
            if (j == 0 && i > 0) {
                cell.classList.add("rowHeader")
                cell.setAttribute("id", "row-"+i)
            } else if (j > 0 && i > 0)  {
                cell.classList.add("spreadsheetCell")
                cell.setAttribute("id", "cell-"+i+"-"+j)
                // console.log(cell.id)
            }
            cell.appendChild(text);
        }
    }
}

let table = document.getElementById("spreadsheet")
let data = spreadArray
generateTable(table, data)

$(document).ready(function(){
    $(".spreadsheetCell").click(function() {    
        deselectAll()
        this.classList.add("selectedCell")
        $(this).attr("contentEditable", "true")
    })
    $(".columnHeader").click(function() {
        deselectAll()
        var columnIndex = (this.id).replace("column-","")
        console.log("Column: " + columnIndex)
        selectColumn(columnIndex)
    })
    $(".rowHeader").click(function() {
        deselectAll()
        var rowIndex = (this.id).replace("row-","")
        console.log("Row: " + rowIndex)
        selectRow(rowIndex)
    })
/*
    $("td").click(function(){
        if($(this).attr("contentEditable") == true){
            $(this).attr("contentEditable","false");
        } else {
            $(this).attr("contentEditable","true");
        }
    })*/

})

function deselectAll() {
    var cells = document.getElementsByClassName("spreadsheetCell")
    for (i=0; i<cells.length; i++) {
        var cellId = cells[i].id
        var element = document.getElementById(cellId)
        element.classList.remove("selectedCell")
        element.contentEditable = false
    }
}

function selectRow(rowIndex) {
    var cells = document.getElementsByClassName("spreadsheetCell")
    var k = 1
    for (i=0; i<cells.length; i++) {
        var cellId = cells[i].id        
        if (cellId == "cell-" + rowIndex + "-" + k) {
            k++
            document.getElementById(cellId).classList.add("selectedCell")
        }
    }
}

function selectColumn(columnIndex) {
    var cells = document.getElementsByClassName("spreadsheetCell")
    var k = 1
    var temp = []
    for (i=0; i<cells.length; i++) {
        var cellId = cells[i].id
        if (cellId == "cell-" + k + "-" + columnIndex) {
            k++
            document.getElementById(cellId).classList.add("selectedCell")
            temp.push(document.getElementById(cellId).innerText)
        }
    }
    console.log(temp)
    gradesData = temp
    gradesData = getFrequency(gradesData)
    makeChart()
    // TODO: extract the data into an array of values
}

function getFrequency(grades) {
    var length = grades.length
    var frequency = [
        {"grade": "A", "frequency": grades.filter(number => number > 80).length/length},
        {"grade": "B", "frequency": grades.filter(number => number >= 65 && number < 80).length/length},
        {"grade": "C", "frequency": grades.filter(number => number >= 55 && number < 65).length/length},
        {"grade": "D", "frequency": grades.filter(number => number >= 50 && number < 55).length/length},
        {"grade": "F", "frequency": grades.filter(number => number < 50).length/length},
    ]

    console.log(frequency);
    return frequency
}

// D3 stuff
/*
window.onload = function() {
    const salesData = [
        {"year": 2012, "sales": 0.1063},
        {"year": 2013, "sales": 0.978},
        {"year": 2014, "sales": 0.1076},
        {"year": 2015, "sales": 0.1214},
        {"year": 2016, "sales": 0.1107},
        {"year": 2017, "sales": 0.1520},
        {"year": 2018, "sales": 0.1712},
        {"year": 2019, "sales": 0.1606},
        {"year": 2020, "sales": 0.18},
    ];

    const margin = 50;
    const width = 800;
    const height = 500;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    const colourScale = d3.scaleLinear()
                            .domain([978, 2188])
                            .range(['red', 'blue']);
    
    const xScale = d3.scaleBand() // discrete, bucket
                        .domain(gradesData.map((data) => data.grade))
                        .range([0, chartWidth])
                        .padding(0.3);
    
    const yScale = d3.scaleLinear()
                        .domain([0, 1])
                        .range([chartHeight, 0]);

    let svg = d3.select('body')
                    .append('svg')
                        .attr('width', width)
                        .attr('height', height);
    
    // title
    svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin)
            .attr('text-anchor', 'middle')
            .text('Grade Distribution');

    
    // create a group (g) for the bars
    let g = svg.append('g')
                    .attr('transform', `translate(${margin}, ${margin})`);

    // y-axis
    g.append('g')
        .call(d3.axisLeft(yScale));
    
    // x-axis
    g.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));
    
    let rectangles = g.selectAll('rect')
        .data(gradesData)
        .enter()
            .append('rect')
                .attr('x', (data) => xScale(data.grade))
                .attr('y', (data) => chartHeight)
                .attr('width', xScale.bandwidth())
                .attr('height', (data) => 0)
                .attr('fill', (data) => colourScale(data.frequency))
                .on('mouseenter', function(source, index) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('opacity', 0.5);
                })
                .on('mouseleave', function(source, index) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('opacity', 1.0);
                });
    
    rectangles.transition()
        .ease(d3.easeElastic)
        .attr('height', (data) => chartHeight - yScale(data.frequency))
        .attr('y', (data) => yScale(data.frequency))
        .duration(1000)
        .delay((data, index) => index * 50);
};*/


function makeChart() {

    d3.select("svg").remove()
    
    const salesData = [
        {"year": 2012, "sales": 0.1063},
        {"year": 2013, "sales": 0.978},
        {"year": 2014, "sales": 0.1076},
        {"year": 2015, "sales": 0.1214},
        {"year": 2016, "sales": 0.1107},
        {"year": 2017, "sales": 0.1520},
        {"year": 2018, "sales": 0.1712},
        {"year": 2019, "sales": 0.1606},
        {"year": 2020, "sales": 0.18},
    ];

    const margin = 50;
    const width = 800;
    const height = 500;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    const colourScale = d3.scaleLinear()
                            .domain([978, 2188])
                            .range(['red', 'blue']);
    
    const xScale = d3.scaleBand() // discrete, bucket
                        .domain(gradesData.map((data) => data.grade))
                        .range([0, chartWidth])
                        .padding(0.3);
    
    const yScale = d3.scaleLinear()
                        .domain([0, 1])
                        .range([chartHeight, 0]);

    let svg = d3.select('body')
                    .append('svg')
                        .attr('width', width)
                        .attr('height', height);
    
    // title
    svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin)
            .attr('text-anchor', 'middle')
            .text('Grade Distribution');

    
    // create a group (g) for the bars
    let g = svg.append('g')
                    .attr('transform', `translate(${margin}, ${margin})`);

    // y-axis
    g.append('g')
        .call(d3.axisLeft(yScale));
    
    // x-axis
    g.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));
    
    let rectangles = g.selectAll('rect')
        .data(gradesData)
        .enter()
            .append('rect')
                .attr('x', (data) => xScale(data.grade))
                .attr('y', (data) => chartHeight)
                .attr('width', xScale.bandwidth())
                .attr('height', (data) => 0)
                .attr('fill', (data) => colourScale(data.frequency))
                .on('mouseenter', function(source, index) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('opacity', 0.5);
                })
                .on('mouseleave', function(source, index) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('opacity', 1.0);
                });
    
    rectangles.transition()
        .ease(d3.easeElastic)
        .attr('height', (data) => chartHeight - yScale(data.frequency))
        .attr('y', (data) => yScale(data.frequency))
        .duration(1000)
        .delay((data, index) => index * 50);
};