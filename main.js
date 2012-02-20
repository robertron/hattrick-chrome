var http = new function() {
	this.post = function( url, data, callback) {
		var header = [{'key' : 'User-agent' , 'value' : 'Mozilla/4.0 (compatible) Greasemonkey'},
  	    	{'key' : 'Content-Type' , 'value' : 'application/x-www-form-urlencoded'},
  	    	{'key' : 'Accept' , 'value' : 'application/atom+xml,application/xml,text/xml'} ];
  	    var request = {'header' : header, 
  	    	'url': url, 
  	    	'data' : data };
  	    
  	    chrome.extension.sendRequest( request, function( data ) {
  	    	callback( data );
  	    } );
	}
	
	this.get = function( url, data, callback ) {
		var header = [{'key' : 'User-agent' , 'value' : 'Mozilla/4.0 (compatible) Greasemonkey' }];
  	    var request = {'header' : header, 
  	    	'url': url + '?' + data };
  	    
  	    chrome.extension.sendRequest( request, function( data ) {
  	    	callback( data );
  	    } );
	}
}

var hattrick = new function() {
	
	function sortPlayer( a, b ) {
	    return b.tsi - a.tsi;
	}
	
	var addPlayers = function( sort, result ) {
		if( sort.length < 1 ) {
			return;
		}
		var sorted = sort.sort(sortPlayer);
		for( var i=0;i<sorted.length;i++ ) {
			result.push( sorted[i].face );
			result.push( sorted[i].info );
			result.push( "<div class=\"borderSeparator\"></div>" );
		}
	}
	
	var getTsi = function( player ) {
		var tsi = $( player ).find( 'p' ).text().replace( /\s/g, '' );
		var reg = /TSI=(\d\s){0,1}\d*/;
		var parsed = reg.exec(tsi)[0];
		parsed = parsed.replace( 'TSI=', '' );
		parsed = parseInt( parsed );
		return parsed;
	}
	
	this.init = function() {
		var result = new Array();
		var sort = new Array();
		
		var playerList = $( '.playerList' ).children();
		for( var i=0; i<playerList.length; i++ ) {
			var entry = playerList[i];
			if ( entry.tagName == 'H2' ) {
				addPlayers( sort, result );
				result.push( entry );
				sort = new Array();
				continue;
			}
			if ( entry.tagName == 'A') {
				addPlayers( sort, result );
				break;
			}
			var player = {};
			player.face = playerList[i];
			player.info = playerList[i+1];
			player.tsi = getTsi( playerList[i+1] );
			sort.push( player );
			i = i + 2;
		}
		
		$( '.playerList' ).html( '' );
		for( var i=0; i<result.length; i++ ) {
			$( '.playerList' ).append( $( result[i] ) );
		}
	}
}

$(document).ready( function() {
	hattrick.init();
});



