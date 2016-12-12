import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import '../imports/api';
import Crawler from './simpliest_crawler/crawler';
import { Maps } from '/imports/api/maps/maps';

function getNextPage(page) {
	let rawPage = Crawler.getPage('https://team.carto.com/maps?page=' + page);
	let maps = Crawler.crawlPage(rawPage);

	maps.forEach(map => {
		if (!Maps.findOne(map._id)) {
			Maps.insert(map);
			getNextPage(page++);
		}
	});
}

Meteor.startup(() => {
	getNextPage(2);
});
