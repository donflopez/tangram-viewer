import { HTTP } from 'meteor/http'
import Cheerio from 'cheerio'

var Crawler = {};

Crawler.getPage = function getPage (url, cb) {
	HTTP.get(url, function (err, response) {
		if (response.content) {
			cb(null, response.content);
		}
		else {
			cb(err, null);
		}
	});
}

Crawler.crawlPage = function crawlPage (data) {
	let $ = Cheerio.load(data);

	let links = extractMapLinks($);

	let mapList = links.map(url => {
		let $2 = Cheerio.load(HTTP.call('GET', url, {followRedirects: false}).content);

		return {url: $2('a').attr('href'), preview: getImagePreview(url), _id: getId(url)};
	});

	return mapList;
}

function extractMapLinks($) {
	let a = $('a.MapCard-header');

	let links = a.map((i, el) => {
		return $(el).attr('href');
	}).get();

	return links;
}

function getId(url) {
	let id = url.match(/\/viz\/(([^\/])*)/g);

	return id && id[0] && id[0].replace('/viz/', '').replace(/-/g, '_');
}

function getUser(url) {
	let user = url.match(/\/u\/(([^\/])*)/g);

	return user && user[0] && user[0].replace('/u/', '');
}

function getImagePreview(url) {

	let user = getUser(url),
		id = getId(url);

	if (!user || !id) {
		return;
	}

	return 'https://cartocdn-ashbu.global.ssl.fastly.net/' + user + '/api/v1/map/static/named/tpl_' + id + '/300/100.png';
}

export default Crawler;
