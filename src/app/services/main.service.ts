import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';
import * as legendColor from 'd3-svg-legend';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient
  ) { }

  public getMapData(): any {
    return this.http.get('http://localhost:4200/assets/countyHeatMapSeries.json');
  }

  public getStatesData(): any {
    return this.http.get('http://localhost:4200/assets/states.json');
  }

  public flatKeys(object, depth): any {
    const paths = []
    const nodes = [{path: [], object}];
    while (nodes.length > 0) {
      const {path, object} = nodes.pop();
      for (const key of Object.keys(object)) {
        const nextPath = [...path, key];
        const nextObject = object[key];
        if (nextPath.length < depth) {
          nodes.unshift({
            path: nextPath,
            object: nextObject
          });
        } else {
          paths.push(nextPath);
        }
      }
    }
    return paths;
  }

  public draw(svg, mapData): void {
    const projection = d3.geoAlbersUsa();

    // mapdData is transaction data with a timestamp and transaction values following each timestamp

    // statesData is USA state geoData


    // const pathGenerator = d3.geoPath().projection(projection);
    const pathGenerator = d3.geoPath();

    const flatMapData = this.flatKeys(mapData, 2);

    console.log('raw flat data', flatMapData);

    const customcolor = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);


    d3.json('/assets/test-us-counties-topo.json')
      .then(data => {

        const dataObjects: any = data;
        const counties: any = topojson.feature(data, dataObjects.objects.counties).features;
        // console.log('my topology', counties);

        const result = _.map(mapData, (value, key) => {
          return value + key;
        });

        // console.log('my raw data result', result);


        // create viewBox
        svg.append('svg')
          .attr('viewBox', [0, 0, 975, 610])
          .append('g')
          .selectAll('path')
          .data(topojson.feature(data, dataObjects.objects.counties).features)
          .join('path')

          // TODO - merge topojson data with countyHeatMap data

          // .style('fill', d => customcolor(d.id)
          .attr('fill', (d) => customcolor(d.id[0]))
          .attr('d', pathGenerator)
          .attr('stroke', (d) => customcolor(d.id))
          .append('title')
          .text(d => d.id);

        // create legend
        // const linear = d3.scaleLinear()
        //   .domain([0, 10])
        //   .range([0, 600]);
        //
        // svg.append('g')
        //   .attr('class', 'legendLinear')
        //   .attr('transform', 'translate(20,20)');
        //
        // const legendLinear = legendColor.legendColor()
        //   .shapeWidth(30)
        //   .orient('horizontal')
        //   .scale(linear);
        //
        // svg.select('.legendLinear')
        //   .call(legendLinear);

        this.getStatesData().subscribe((statesData) => {
          const extractedStates = new Map(statesData.features.map(d => [d.id, d.properties]));

          console.log('extracted state data', extractedStates);

          svg.append('path')
            .datum(topojson.mesh(statesData, extractedStates, (a, b) => a !== b))
            .attr('fill', 'steelblue')
            .attr('stroke', 'green')
            .attr('stroke-linejoin', 'round')
            .attr('d', pathGenerator);
        });
      });
  }

}
