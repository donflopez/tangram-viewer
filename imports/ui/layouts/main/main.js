import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import L from '/public/leaflet.js';

import { Maps } from '/imports/api/maps/maps';
import { Layers } from '/imports/api/layers/layers';

import Carto from './lib/carto-helpers';
import TH from './lib/tangram-helper';
import Utils from './lib/utils';

import './main.scss';
import './arrow.scss';
import './main.html';

Template.main.helpers({
	maps: function() {
		return Maps.find({}).fetch();
	},

	active: function() {
		return Session.get('active');
	}
});

Template.side.helpers({
	opened: function () {
		return Session.get('sideIsOpened') ? 'open' : 'closed';
	}
});

Template.side.events({
	'click #side-button': function () {
		Session.set('sideIsOpened', !Session.get('sideIsOpened'));
	}
});

Template.map.events({
	'click li.map': function() {

		Session.set('active', true);
		TH.removeLayers(window.sceneLayer);
		Layers.find({}).forEach(ly => {
			Layers.remove(ly._id);
		});

		let uri = this.url;
		return Utils.spawn(function*() {
			let vizUri = Carto.generateVizUri(uri);
			let viz = yield Carto.getVizJSON(vizUri);
			let jpUri = Carto.generateJSONPUri(viz);
			let jsonP = yield Carto.getJSONP(jpUri);

			TH.addSource(window.sceneLayer, Carto.generateSource(viz.datasource));
			let jpLayers = jsonP.metadata.layers;
			viz.layers = viz.layers.reverse();
			jpLayers = jpLayers.reverse();
			viz.layers.forEach((ly, i) => {
				if (ly.type === 'CartoDB') {
					let layer = {
						id: jpLayers[i].id,
						_id: jpLayers[i].id,
						opened: false,
						cartocss: jpLayers[i].meta.cartocss,
						name: ly.options.layer_name
					};

					Layers.insert(layer);

					TH.addLayer(window.sceneLayer, layer);
					TH.setLayerDraw(window.sceneLayer, layer);
				}
			});

		});
	}
});

Template.mapView.helpers({
	layers: function () {
		return Layers.find().fetch();
	}
});

Template.mapView.onRendered(function() {
	let map = window.map = L.map( 'map' );

	L.tileLayer( 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	    attribution: '<a href="http://carto.com">CARTO</a> © 2016',
	    maxZoom: 18
	} ).addTo( map );

	window.sceneLayer = TH.startTangram(map);

	map.setView( [40.18579800351785,-95.045989688719], 5 );
});

Template.mapView.events({
	'click li.element': function() {

	}
});

Template.layer.helpers({
	opened: function() {
		return this.opened ? 'opened' : '';
	}
});

Template.layer.events({
	'click span.name': function() {
		Layers.update(this._id, {$set: {opened: !this.opened}});
	},

	'click span.save': function(e, t) {
		this.cartocss = t.find('.cartocss').value;
		TH.setLayerDraw(window.sceneLayer, this);
	}
});
