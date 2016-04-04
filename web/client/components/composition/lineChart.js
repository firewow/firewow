import React from 'react';

export default class LineChart extends React.Component {

    componentDidMount() {
        this.drawCharts();
    }

    componentDidUpdate() {
        this.drawCharts();
    }

    drawCharts() {
        var data = google.visualization.arrayToDataTable(this.props.data);
        var options = {
            title: '',
            backgroundColor: '#222222',
            legendTextStyle: { color: '#FFF' },
            titleTextStyle: { color: '#FFF' },
            hAxis: {
                textStyle:{color: '#FFF'}
            },
            vAxis: {
                textStyle:{color: '#FFF'}
            }
        };

        var chart = new google.visualization.LineChart(
            document.getElementById(this.props.graphName)
        );
        chart.draw(data, options);
    }

    render() {
        return React.DOM.div({id: this.props.graphName, style: {width: "100%", height: "500px"}});
    }

}
