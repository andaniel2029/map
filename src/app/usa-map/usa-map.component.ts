import {Component, ElementRef, OnInit} from '@angular/core';
import {MainService} from '../services/main.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-usa-map',
  templateUrl: './usa-map.component.html',
  styleUrls: ['./usa-map.component.scss']
})
export class UsaMapComponent implements OnInit {
  title = 'map-poc';
  hostElement = this.elRef.nativeElement;

  constructor(
    private mainService: MainService,
    private elRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.mainService.getMapData().subscribe((mapData) => {
      console.log('raw map data', mapData);
      this.mainService.draw(d3.select('body'), mapData);
    });
  }
}
