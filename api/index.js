const stateAbbreviations = require('./state-abbreviations.json');
const statePolygonData = require('./us-states.json');
const stateSimplePolygonData = require('./us-states-simple.json');
const countyPolygonData = require('./us-counties.json');
const statePopulationData = require('./state-populations.json');

const stateIdMap = statePolygonData.features.reduce((map, state) => {
  const { NAME: stateName, STATE: id } = state.properties;
  const stateInfo = stateAbbreviations.find(info => info.name.toLowerCase() === stateName.toLowerCase());
  const { abbreviation } = stateInfo || {};
  return {
    [id]: abbreviation,
    ...map,
  };
}, {});

const stateDetailsPolygons = statePolygonData.features.map((state) => {
  const { NAME: stateName } = state.properties;
  const stateInfo = stateAbbreviations.find(info => info.name.toLowerCase() === stateName.toLowerCase());
  const { abbreviation: id } = stateInfo || {};
  let { coordinates } = state.geometry || { coordinates: [] };
  const { type } = state.geometry || {};

  if (!id) return null;

  if (type === 'MultiPolygon') {
    coordinates = [].concat(...coordinates);
  }

  return {
    id,
    polygons: coordinates.map(polygon => polygon.map(point => ({
      lat: point[1],
      lng: point[0],
    }))),
  };
})
  .filter(state => state !== null);

const stateSimplePolygons = Object.keys(stateSimplePolygonData).map((state) => {
  const stateInfo = stateAbbreviations.find(info => info.name.toLowerCase() === state.toLowerCase());
  const { abbreviation: id } = stateInfo || {};
  const { Coordinates: points = [] } = stateSimplePolygonData[state] || {};

  if (!id) return null;

  return {
    id,
    polygons: [points],
  };
})
  .filter(state => state !== null);

const countyPolygons = countyPolygonData.features.map((county) => {
  const { STATE: stateId, NAME: countyName } = county.properties;
  let { coordinates } = county.geometry || { coordinates: [] };
  const { type } = county.geometry || {};

  if (type === 'MultiPolygon') {
    coordinates = [].concat(...coordinates);
  }

  return {
    id: `${stateIdMap[stateId]}-${countyName.replace(' ', '-')}`,
    statePolygonId: stateIdMap[stateId],
    detailedStatePolygonId: stateIdMap[stateId],
    polygons: coordinates.map(polygon => polygon.map(point => ({
      lat: point[1],
      lng: point[0],
    }))),
  };
});

const statePopulations = statePopulationData.map((state) => {
  const stateData = state;
  stateData.id = stateData.code;
  delete stateData.code;
  return stateData;
});

module.exports = () => ({
  detailedStatePolygons: stateDetailsPolygons,                       // use this one for more detailed polygons
  statePolygons: stateSimplePolygons,
  countyPolygons,
  'census-data': statePopulations,
});
