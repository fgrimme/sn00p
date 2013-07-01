/* Patterns to detect SQLi, XSS & LFI-Attacks with regular expressions
 * For more information about the patterns see:
 * http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks
 */
var patterns = {};

patterns.xss = [/((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i, //Simple XSS
	/((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i, //IMG SRC XSS
	/((\%3C)|<)[^\n]+((\%3E)|>)/i]; //All XSS

patterns.lfi = [/\.\.\//]; //Basic ../ match

patterns.sql = [/((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-))/i, //SQL meta-characters
	/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i, //Simple SQLi
	/((\%27)|(\'))union/i, //SQLi with UNION
	/exec(\s|\+)+(s|x)p\w+/i, //SQLi for MSSQL
	/UNION(?:\s+ALL)?\s+SELECT/i]; //SQLi UNION SELECT

exports.patterns = patterns;