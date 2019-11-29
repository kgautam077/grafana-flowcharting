// import FlowChartingPlugin from './plugin';
import _ from 'lodash';
import Metric, { Serie, Table } from './metric_class';
import * as gf from '../types/flowcharting';

// import { Table, Serie } from './metric_class';
// declare var GFP: FlowChartingPlugin;

export default class MetricHandler {
  panel: any;
  $scope: ng.IScope;
  tables: Table[] = [];
  series: Serie[] = [];
  metrics: Array<Serie | Table> = [];
  constructor($scope: ng.IScope) {
    this.$scope = $scope;
  }

  initData(dataList: any) {
    this.tables = [];
    this.series = [];
    this.metrics = [];
    
    dataList.forEach(dl => {
      this.addMetric(dl);
    });
    console.log("TCL: MetricHandler -> initData -> this", this)

  }

  addMetric(data: any) {
    console.log('TCL: MetricHandler -> addMetric -> data', data);

    if (data.type === 'table') {
      this.addTable(data);
    } else {
      this.addSerie(data);
    }
  }

  addTable(data: any): Table {
    const table = new Table(data);
    this.tables.push(table);
    this.metrics.push(table);
    return table;
  }

  addSerie(data: any): Serie {
    const serie = new Serie(data);
    this.series.push(serie);
    this.metrics.push(serie);
    return serie;
  }

  getNames(type?: gf.TMetricType): string[] {
    if (type === 'serie') return this.series.map(m => m.getName());
    if (type === 'table') return this.tables.map(m => m.getName());
    return this.metrics.map(m => m.getName());
  }

  getMetrics(type?: gf.TMetricType): Metric[] {
    if (type === 'serie') return this.series;
    if (type === 'table') return this.tables;
    return this.metrics;
  }

  isTypeOf(type?: gf.TMetricType): boolean {
    if (type === 'serie') return this.series.length > 0;
    if (type === 'table') return this.tables.length > 0;
    return false;
  }

  findMetrics(name: string, type?: gf.TMetricType): Metric[] {
    let metrics: Metric[] = [];
    if (type) {
      if (type === 'table') metrics = this.tables.filter(m => m.getName() === name);
      if (type === 'serie') metrics = this.series.filter(m => m.getName() === name);
    } else metrics = this.metrics.filter(m => m.getName() === name);
    return metrics;
  }

  getColumnsName(metricName, type?: gf.TMetricType): string[] {
    let metrics = this.findMetrics(metricName, type);
    let columns: string[] = [];
    metrics.forEach(m => {
      columns = columns.concat(m.getColumnsName());
    });
    return columns;
  }
}
