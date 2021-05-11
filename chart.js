//import { select, json, tree, hierarchy, linkHorizontal } from 'd3';

var treeData = {
  "name": "경희대학교",
  "children": [
      {
          "name": "서울과학기술대학교",
          "children":[
              {
                  "name": "부천대학교"
              }
          ]
      },
      {
          "name": "아주대학교",
          "children":[
              {
                  "name": "인하대학교",
                  "children":[
                      {
                          "name": "경북대학교"
                      }
                  ]
              }
          ]
      }
  ]
}
$( document ).ready(function() {

  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  const svg = d3.select('div')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const treeLayout = d3.tree().size([height, width]); // (*)

  d3.json('https://github.com/Nayoung-Oh/FrienndsMapProject/blob/a6fccad0e1efcc15dd3be86f6fb240635af7eb36/Log2.json').then(data => {
    const root = d3.hierarchy(data);  // (*)
    const links = treeLayout(root).links();  // (*)
    const linkPathGenerator = d3.linkHorizontal()  // (*)
      .x(d => d.y)
      .y(d => d.x);

    svg
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', linkPathGenerator);
  });
  
});
