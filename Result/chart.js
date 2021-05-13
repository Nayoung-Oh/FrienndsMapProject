// https://bl.ocks.org/d3noob/8375092
// https://velog.io/@takeknowledge/%EB%A1%9C%EC%BB%AC%EC%97%90%EC%84%9C-CORS-policy-%EA%B4%80%EB%A0%A8-%EC%97%90%EB%9F%AC%EA%B0%80-%EB%B0%9C%EC%83%9D%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0-3gk4gyhreu
$( document ).ready(function() {
	const home = [127, 37];
	mapboxgl.accessToken = ; //put your own accessToken
	var map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: home, // starting position [lng, lat]
	zoom: 5 // starting zoom
	});
	var option = document.getElementById("person");
	
	var markerlist = [];
	var treeData;

	var margin = {top: 20, right: 120, bottom: 20, left: 120},
		width = 2000 - margin.right - margin.left,
		height = 350 - margin.top - margin.bottom;
		
	var i = 0,
		duration = 750,
		root;
	
	var tree = d3.layout.tree()
		.size([height, width]);

	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("#body").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	option.onchange = function(){
		if (option.selectedIndex == 0){
			update(null);
			return;
		}
		treeData = treeDataList[option.selectedIndex - 1];
		root = treeData[0];
		root.x0 = height / 2;
		root.y0 = 0;
		update(root);
		markerlist.forEach((marker) => marker.remove());
		markerlist = [];
		for (var i = 0; i < 4; i++){
			if (map.getLayer('route'+i)) {
				map.removeLayer('route'+i);
			}
			if (map.getSource('route'+i)) {
				map.removeSource('route'+i);
			}
		}
		map.setCenter(home);
		map.setZoom(5);
	}

	d3.select(self.frameElement).style("height", "500px");

	function update(source) {

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);
		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
				d.y = d.depth * 200;
				d.clicked = false;	
			});

		// Update the nodes…
		var node = svg.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); });

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			.on("click", click);

		nodeEnter.append("circle")
			.attr("r", 1e-6)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		nodeEnter.append("text")
			.attr("x", function(d) { return d.children || d._children ? -13 : 13; })
			.attr("dy", "-.8em")
			.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
			.text(function(d) { return d.name; })
			.style("fill-opacity", 1e-6)
			.style("font-size", "10px")
			.style("font-family", 'Do Hyeon');


		// Transition nodes to their new position.
		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		nodeUpdate.select("circle")
			.attr("r", 10)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		nodeUpdate.select("text")
			.style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			.remove();

		nodeExit.select("circle")
			.attr("r", 1e-6);

		nodeExit.select("text")
			.style("fill-opacity", 1e-6);

		// Update the links…
		var link = svg.selectAll("path.link")
			.data(links, function(d) { return d.target.id; });

		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
				var o = {x: source.x0, y: source.y0};
				return diagonal({source: o, target: o});
			});

		// Transition links to their new position.
		link.transition()
			.duration(duration)
			.attr("d", diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition()
			.duration(duration)
			.attr("d", function(d) {
				var o = {x: source.x, y: source.y};
				return diagonal({source: o, target: o});
			})
			.remove();

		// Stash the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	}

	function click(d) {
		
		var nodes = tree.nodes(d);
		markerlist.forEach((marker) => marker.remove());
		markerlist = [];
		for (var i = 0; i < 4; i++){
			if (map.getLayer('route'+i)) {
				map.removeLayer('route'+i);
			}
			if (map.getSource('route'+i)) {
				map.removeSource('route'+i);
			}
		}
		
		if (d.clicked){
			var nodesR = tree.nodes(root);
			svg.selectAll("g.node").select("circle").style("fill", "white");
			nodesR.forEach(function(n) {
				n.clicked = false;	
			});
			map.setCenter(home);
			map.setZoom(4);
			return;
		}
		else{
			var nodesR = tree.nodes(root);
			svg.selectAll("g.node").select("circle").style("fill", "white");
			nodesR.forEach(function(n) {
				n.clicked = false;	
			});
			d.clicked = true;
			d3.select(this).select("circle").style("fill", "lightsteelblue");
		}
		var pathlist = [];
		var nr = [];
		y = 0;
		console.log(pathlist);
		nodes.forEach(function(n){
			for (var i = 0; i < pos.length; i++){
				if (pos[i].name === n.name){
					var popup = new mapboxgl.Popup()
  					.setText(pos[i].name)
  					.addTo(map);
					var marker = new mapboxgl.Marker({
						color: "red",
						draggable: false
						}).setLngLat([pos[i].lng, pos[i].lat]).addTo(map).setPopup(popup);
					markerlist.push(marker);
					if (n.parent == d){
						pathlist.push([pos[i].lng, pos[i].lat]);
					}else if (n == d){
						nr = [pos[i].lng, pos[i].lat];
					}
					break;
				}
			}
		})
		map.setCenter(nr);
		if (pathlist.length == 0){
			map.setZoom(14);
		}
		else{
			map.setZoom(7);
		}
		
		for (var i = 0; i < pathlist.length; i++){
			map.addSource('route'+i, {
				'type': 'geojson',
				'data': {
				'type': 'Feature',
				'properties': {},
				'geometry': {
				'type': 'LineString',
				'coordinates': [nr , pathlist[i]]
				}
				}
			});
			map.addLayer({
				'id': 'route'+i,
				'type': 'line',
				'source': 'route'+i,
				'layout': {
				'line-join': 'round',
				'line-cap': 'round'
				},
				'paint': {
				'line-color': 'lightsteelblue',
				'line-width': 5,
				'line-opacity': 0.8
				}
				});
			}
		
		}
});
