fetch('./europe.json')
  .then(data => data.json())
  .then(data => console.log(data.objects.countries.geometries));

const width = 960,
  height = 700;

const projection = d3
  .geoConicConformal()
  .rotate([-10, 0])
  .center([0, 53])
  .parallels([29.5, 45.5])
  .scale(1100)
  .translate([width / 2, height / 2]);

const path = d3.geoPath(projection);

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json('./europe.json').then(europe => {
  svg
    .selectAll('.countries')
    .data(topojson.feature(europe, europe.objects.countries).features)
    .enter()
    .append('path')
    .attr('class', 'countries')
    .style('fill', d => {
      d3.json('./stats.json').then(stats => {
        console.log(stats);
        if (d.id === stats) {
          return '#000000';
        } else {
          return '#999999';
        }
      });
    })
    .style('stroke', '#9a9a9a')
    .style('stroke-width', '0.3px')
    .attr('d', path);
});

d3.select(self.frameElement).style('height', height + 'px');
