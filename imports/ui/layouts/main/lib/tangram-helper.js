import CCSS from '/public/tangram-cartocss.debug.js';
import Tangram from '/public/tangram.debug.js';

var TH = {};

export default TH;

TH.startTangram = function (map) {
  return Tangram.leafletLayer({
    scene: '/scene.yaml',
    logLevel: 'debug'
  }).addTo(map).scene;
};

TH.setLayerDraw = function (scene, layer) {
  scene.config.layers[layer.id].draw = CCSS.carto2Draw(layer.cartocss);
  scene.updateConfig();
};

TH.addLayer = function (scene, layer) {
  scene.config.layers[layer.id] = {
    data: {
      layer: layer.id,
      source: 'CartoDB'
    }
  };
};

TH.addSource = function (scene, url) {
  scene.config.sources['CartoDB'] = {
    id: 1,
    type: 'MVT',
    rasters: ['normals'],
    url: url
  };
};

TH.removeLayers = function (scene) {
  if (!scene) return;
  scene.config.layers = {};
  scene.updateConfig();
};
