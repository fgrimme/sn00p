var sys = require('sys');
var typeUtils = require('../utils/typeutils').TypeUtils;

var Snoop = function(permissions, snoops) {
	var _permissions = permissions;
	var _snoops = snoops || [];
	
	if (!_permissions) throw 'need permissions to check';	
	
	this.check = function(request, response, buffer){
		// check if the ip is allowed/banned
		if (!_checkPermissions(request, response)) return false;
		// check if the data/cookies contain attack signatures
		return _checkPatterns(request, response, buffer);
	};
	
	this.checkPermissions = function(request, response){
		// ip address of the crrent request
		var ip = request.connection.remoteAddress;
		
		// check the requests against blacklist
		if (permissions.isBanned(ip)) return false;
		// check the requests against whitelist
		if (!permissions.isAllowed(ip)) return false;
		return true;
	};
	
	this.checkPatterns = function(request, response, buffer) {
		// ip address of the crrent request
		var ip = request.connection.remoteAddress;
		if (typeUtils.compare(_snoops, [])) {
			for (var i in _snoops) {
				var snoop = _snoops[i];
				// check the request for brute-force attacks
				if (snoop.check(request, response, buffer)) {
					// add ip to the blacklist
					permissions.ban(ip);
					return false;
				}
			}
		}
		return true;
	};
};

exports.Snoop = Snoop;