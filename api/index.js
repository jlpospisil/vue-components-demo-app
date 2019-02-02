const stateAbbreviations = require('./state-abbreviations.json');
const statePolygonData = require('./us-states.json');
const statePopulationData = require('./state-populations.json');

const statePolygons = statePolygonData.features.map((state) => {
  const { NAME: stateName } = state.properties;
  const stateInfo = stateAbbreviations.find((info) => info.name.toLowerCase() === stateName.toLowerCase());
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
    // points: coordinates.map(point => ({
    //   lat: point[1],
    //   lng: point[0],
    // })),
  };
})
  .filter(state => state !== null);

const statePopulations = statePopulationData.map((state) => {
  let stateData = state;
  stateData.id = stateData.code;
  delete stateData.code;
  return stateData;
});

module.exports = () => {
  return {
    statePolygons,
    'census-data': statePopulations,
  };
};
