const ratesObj = {};

async function getVatData() {
  document.querySelector('.loading').classList.add('displayed');
  await fetch('./rates.json')
    .then(response => response.json())
    .then(data =>
      data.rates.map(country => {
        ratesObj[country.name] = country.periods[0].rates.standard;
      }),
    );
  getMap();
}

function getMap() {
  const width = 960;
  const height = width / 1.37;
  const vatValues = Object.values(ratesObj);
  const vatCountries = Object.keys(ratesObj);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip');

  const color = d3
    .scaleLinear()
    .domain([d3.min(vatValues), d3.mean(vatValues), d3.max(vatValues)])
    .range(['green', 'yellow', 'red']);

  const projection = d3
    .geoConicConformal()
    .rotate([-10, 0])
    .center([0, 51])
    .parallels([29.5, 45.5])
    .scale(1255)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection);

  const svg = d3
    .select('.europeMap')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  d3.json('./europe.topojson').then(europe => {
    svg
      .selectAll('.countries')
      .data(topojson.feature(europe, europe.objects.europe).features)
      .enter()
      .append('path')
      .attr('class', 'countries')
      .style('fill', d => (vatCountries.includes(d.properties.name) ? color(ratesObj[d.properties.name]) : '#E5E5E5'))
      .style('stroke', '#9a9a9a')
      .style('stroke-width', '0.3px')
      .attr('d', path)
      .on('mouseover', d => {
        vatCountries.includes(d.properties.name) &&
          tooltip.style('display', 'block').html(
            `<p><strong>${d.properties.name}</strong></p>
      <p>${ratesObj[d.properties.name]}%</p>`,
          );
      })
      .on('mousemove', () => tooltip.style('top', `${d3.event.pageY + 10}px`).style('left', `${d3.event.pageX + 20}px`))
      .on('mouseout', () => tooltip.style('display', 'none'));
  });

  d3.select(self.frameElement).style('height', height + 'px');
  document.querySelector('.loading').classList.remove('displayed');
}

getVatData();
