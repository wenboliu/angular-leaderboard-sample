var $ = require('jquery');
var fixtureUtils = {loadFixture:function(html){
	$(html).appendTo('body');
}, removeFixture:function(selector){
	$(selector).remove();
}};

module.exports = fixtureUtils;
