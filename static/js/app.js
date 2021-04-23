function optionChanged() {
  
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("selDataset").node();
    
    // Assign the dropdown menu option to a variable
    var selectedOption = dropdownMenu.value;

    console.log(selectedOption);

    optionChanged();
};


function getData() {

    // Read the JSON file
    d3.json('samples.json').then(function(data) {

        // Create variable for the dropdown (select tag)
        var select = d3.select('select');

        // Append option tags for each ID in the names array
        Object.entries(data.names).forEach(function([key, value]) {
            var option = select.append('option')
            option.text(value)});

        // Create variable for subject of interest
        var selectedOption = document.getElementById('selDataset');
        var selectedOption = selectedOption.options[selectedOption.selectedIndex].value;
        console.log(selectedOption)

        // Create a function that returns metadata based on id number
        function filterData(person) {
            return person.id == selectedOption;
        };

        // Filter metadata by subject of interest
        var filteredData = data.metadata.filter(filterData);
        console.log(filteredData[0]);

        // Create a variable for the Demographic Info panel
        var panel = d3.select('panel-body');

        // Initialize panel
        panel.selectAll('*').remove();

        // Append information on subject based on dropdown value
        Object.entries(filteredData[0]).forEach(function([key, value]) {
            var row = panel.append('tr')
            row.text(`${key}: ${value}`);
        })
        
        // Filter sample data by subject of interest
        var filteredSample = data.samples.filter(filterData);
        var filteredSample = filteredSample[0];
        console.log(filteredSample);

        // Pull all data from samples for bubble chart plotting
        sampleIDs = filteredSample.otu_ids;
        sampleValues = filteredSample.sample_values;
        sampleLabels = filteredSample.otu_labels;

        // Slice the first 10 objects for bar chart plotting
        slicedIDs = filteredSample.otu_ids.slice(0, 10);
        slicedValues = filteredSample.sample_values.slice(0, 10);
        slicedLabels = filteredSample.otu_labels.slice(0, 10);
        console.log(slicedIDs, slicedValues, slicedLabels)

        // Trace1 for the horizontal bar chart
        var trace1 = {
            x: slicedValues,
            y: slicedIDs.toString(),
            text: slicedLabels,
            type: 'bar',
            orientation: 'h'
        };

        var hbarChart = [trace1];

        var layout1 = {
            title: 'Top 10 Samples'
        };

        Plotly.newPlot('bar', hbarChart, layout1)

        // Trace2 for the bubble chart
        var trace2 = {
            x: sampleIDs,
            y: sampleValues,
            text: sampleLabels,
            mode: 'markers',
            marker: {
                color: sampleIDs,
                size: sampleValues
            }
        };

        var bubbleChart = [trace2]

        var layout2 = {
            title: 'All Sample Sizes',
            showlegend: false
        }

        Plotly.newPlot('bubble', bubbleChart, layout2)
    });
};