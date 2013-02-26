// Youtube Extractor
function youtube(url){
					var youtube_id;
					youtube_id = url.replace(/^[^v]+v.(.{11}).*/,"$1");
					return youtube_id;
}