var sys  = require('sys');

BruteForce = function(permContr) {
	var _this = this;
	var _TIME = 30;
	var _MAX_TRIES = 10;
	var _CLEAN = 15;
	var _connections = {};
	var _URLS = ['/login', '/sign'];
	var _permContr = permContr;
	
	// Collect the garbage to release memory
	var _releaseMem = function(){
		sys.log('Delete old connections');
		now = Date.now();
		for (i in _connections) {
			if (_connections[i]['timestamp'] + _TIME*1000 < now) {
				sys.log('Reset IP: ' + i);
				delete _connections[i]['tries'];
				delete _connections[i]['timestamp'];
			}
		}
		setTimeout(_releaseMem, _CLEAN*1000);
	};
	
	var _reset = function(ip){
		_connections[ip]['tries'] = 1;
		_connections[ip]['timestamp'] = Date.now();
	};

	var _addConnection = function(ip){
		if (_connections[ip]) {
			sys.log('Increase ' + ip);
			_connections[ip]['tries'] += 1;
		} else {
			sys.log('Add ' + ip + ' to connections');
			_connections[ip] = {'tries': 1, 'timestamp': Date.now()};
		}
		sys.log(_connections[ip]['tries']);
	};
	
	this.check = function(ip, url){
		sys.log('BruteForce check IP: ' + ip + ' - URL: ' + url);
		
		var protect = false;
		for (i in _URLS) {
			if (_URLS[i] === url) protect = true;
		}
		if (!protect) return false;
		
		if (_connections[ip])  {
			tries = _connections[ip]['tries'];
			timestamp  = _connections[ip]['timestamp'];
			
			too_much = tries >= _MAX_TRIES;
			in_time  = timestamp + _TIME*1000 > Date.now();
			
			if (too_much && in_time){
				sys.log('IP: ' + ip + ' blocked');
				_permContr.ban(ip);
				return true;
			} else if (!in_time) {
				sys.log('Reset counter for IP: ' + ip);
				_reset(ip);
			} else {
				_addConnection(ip);
			} 
		} else{
			_addConnection(ip);
		}
		return false;
	};
	
	_releaseMem();
};
exports.BruteForce = BruteForce;