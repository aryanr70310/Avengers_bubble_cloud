/**
 * @class
 */
class bub {
    /**
     * @constructor
     * @param {list} list_of_data data
     * @param {variable} maxRadius maximum radius of bubble
     * @param {variable} collisionPadding cushion size when bubbles collide
     * @param {variable} minCollisionRadius distance needed for collisions to take place
     * @param {list} margin dimensions of margin
     * @param {variable} h height 
     * @param {variable} w width
     * @param {variable} j jitter
     * @param {variable} wrd_siz adjusting size of the words on the bubbles(increasing the value will decrease size)
     */
    constructor(list_of_data,maxRadius,collisionPadding,minCollisionRadius,margin,h,w,j,wrd_siz) {
      this.list_of_data = list_of_data;
      this.maxRadius = maxRadius;
      this.collisionPadding=collisionPadding;
      this.minCollisionRadius=minCollisionRadius;
      this.margin=margin;
      this.h=h;
      this.w=w;
      this.j=j;
      this.wrd_siz=wrd_siz;
    }

    /**
     * @function main() is a function which needs to be called at the end main()
     */
    main() {
        var Bubbles, root;
        root = typeof exports !== "undefined" && exports !== null ? exports : this;
        /**
         * @constant {helps with reusability}_this
         */
        const _this = this;
        /**
         * @function Bubbles() contains variable declaratons and function definitions
         */
        Bubbles = function() {
          var chart, clear, click, collide, connectEvents, data, force, gravity, hashchange, height, idValue, jitter, label, mouseout, mouseover, node, rScale, rValue, tick, update, updateActive, updateLabels, updateNodes, width;
          width = _this.w;
          height = _this.h;
          data = [];
          node = null;
          label = null;
          rScale = d3.scale.sqrt().range([0, _this.maxRadius]);
          /**
           * @function rValue() returns an integer value of the 'name' object of the parameter
           * @param d count of d is returned
           */
          rValue = function(d) {
            return parseInt(d.count);
          };
          /**@function idValue() returns 'name' object of parameter
           * @param d name of d is returned
           */
          idValue = function(d) {
            return d.name;
          };
          jitter = _this.j;
          /**@function gravity() adjusts gravity which helps in making the visualization interactive
           * @param alpha a variable for calculation
           */
          gravity = function(alpha) {
            var ax, ay, cx, cy;
            cx = width / 2;
            cy = height / 2;
            ax = alpha / 8;
            ay = alpha;
            return function(d) {
              d.x += (cx - d.x) * ax;
              return d.y += (cy - d.y) * ay;
            };
          };
          /**@function collide() is used in making the bubbles interative and also applies the jitter effect in the visualization
           * @param jitter the variable which decides how sensitive the bubbles are to one another
           */
          collide = function(jitter) {
            return function(d) {
              return data.forEach(function(d2) {
                var distance, minDistance, moveX, moveY, x, y;
                if (d !== d2) {
                  x = d.x - d2.x;
                  y = d.y - d2.y;
                  distance = Math.sqrt(x * x + y * y);
                  minDistance = d.forceR + d2.forceR + _this.collisionPadding;
                  if (distance < minDistance) {
                    distance = (distance - minDistance) / distance * jitter;
                    moveX = x * distance;
                    moveY = y * distance;
                    d.x -= moveX;
                    d.y -= moveY;
                    d2.x += moveX;
                    return d2.y += moveY;
                  }
                }
              });
            };
          };
          /**@function tick() adjusts margin
           * @param e variable used in calculations
           */
          tick = function(e) {
            var dampenedAlpha;
            dampenedAlpha = e.alpha * 0.1;
            node.each(gravity(dampenedAlpha)).each(collide(jitter)).attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            });
            return label.style("left", function(d) {
              return ((_this.margin.left + d.x) - d.dx / 2) + "px";
            }).style("top", function(d) {
              return ((_this.margin.top + d.y) - d.dy / 2) + "px";
            });
          };
          /**@function clear() sets all bubbles to inactive (called when user clicks the white space)
          */
          clear = function() {
            return location.replace("#");
          };
          /**@function click() catches a click event (called when someone clicks on a bubble to decide which bubble is active)
          * @param d url
          */
          click = function(d) {
            location.replace("#" + encodeURIComponent(idValue(d)));
            return d3.event.preventDefault();
          };
          /**@function mouseover() catches a mouseover event (called when someone hovers over a bubble and highlight it)
          * @param d url
          */
          mouseover = function(d) {
            return node.classed("bubble-hover", function(p) {
              return p === d;
            });
          };
          /**@function mouseout() catches a mouseout event (called when someone hovers away from a bubble)
          * @param d url
          */
          /*@function*/mouseout = function(d) {/*catches a mouseout event*/
            return node.classed("bubble-hover", false);
          };
          /**@function connectEvents() combines events into a single function which can directly be called instead of having to call a separate function for each event
           * @param d url
           */
          connectEvents = function(d) {
            d.on("click", click);
            d.on("mouseover", mouseover);
            return d.on("mouseout", mouseout);
          };
          /**@function updateNodes() ajusts nodes in visalization
           */
          updateNodes = function() {
            node = node.selectAll(".bubble-node").data(data, function(d) {
              return idValue(d);
            });
            node.exit().remove();
            return node.enter().append("a").attr("class", "bubble-node").attr("xlink:href", function(d) {
              return "#" + (encodeURIComponent(idValue(d)));
            }).call(force.drag).call(connectEvents).append("circle").attr("r", function(d) {
              return rScale(rValue(d));
            });
          };
          /**@function updateLabels() adjusts size and other attributes of labels containing item name in bubble
           */
          updateLabels = function() {
            var labelEnter;
            label = label.selectAll(".bubble-label").data(data, function(d) {
              return idValue(d);
            });
            label.exit().remove();
            labelEnter = label.enter().append("a").attr("class", "bubble-label").attr("href", function(d) {
              return "#" + (encodeURIComponent(idValue(d)));
            }).call(force.drag).call(connectEvents);
            labelEnter.append("div").attr("class", "bubble-label-name").text(function(d) {
              return idValue(d);
            });
            labelEnter.append("div").attr("class", "bubble-label-value").text(function(d) {
              return rValue(d);
            });
            label.style("font-size", function(d) {
              return Math.max(8, rScale(rValue(d) / _this.wrd_siz)) + "px";
            }).style("width", function(d) {
              return 2.5 * rScale(rValue(d)) + "px";
            });
            label.append("span").text(function(d) {
              return idValue(d);
            }).each(function(d) {
              return d.dx = Math.max(2.5 * rScale(rValue(d)), this.getBoundingClientRect().width);
            }).remove();
            label.style("width", function(d) {
              return d.dx + "px";
            });
            return label.each(function(d) {
              return d.dy = this.getBoundingClientRect().height;
            });
          };
          /**@function update() calls updateNodes() and updateLabels()
           */
          update = function() {
            data.forEach(function(d) {
              return d.forceR = Math.max(_this.minCollisionRadius, rScale(rValue(d)));
            });
            force.nodes(data).start();
            updateNodes();
            return updateLabels();
          };
          /**@function updateActive() conveys whether a bubble is active or not
           * @param id variable used in checking
           */
          updateActive = function(id) {
            node.classed("bubble-selected", function(d) {
              return id === idValue(d);
            });
            if (id.length > 0) {
              return d3.select("#status").html("<h3>The bubble <span class=\"active\">" + id + "</span> is now active</h3>");
            } else {
              return d3.select("#status").html("<h3>No bubble is active</h3>");
            }
          };
          /**@function hashchange() is used in finding out whether a bubble is active
           */
          hashchange = function() {
            var id;
            id = decodeURIComponent(location.hash.substring(1)).trim();
            return updateActive(id);
          };
          force = d3.layout.force().gravity(0).charge(0).size([width, height]).on("tick", tick);
          /**@function chart() uses svg needed to create visualization
           * @param selection variable used by d3
           */
          chart = function(selection) {
            return selection.each(function(rawData) {
              var maxDomainValue, svg, svgEnter;
              data = rawData;
              maxDomainValue = d3.max(data, function(d) {
                return rValue(d);
              });
              rScale.domain([0, maxDomainValue]);
              svg = d3.select(this).selectAll("svg").data([data]);
              svgEnter = svg.enter().append("svg");
              svg.attr("width", width + _this.margin.left + _this.margin.right);
              svg.attr("height", height + _this.margin.top + _this.margin.bottom);
              node = svgEnter.append("g").attr("id", "bubble-nodes").attr("transform", "translate(" + _this.margin.left + "," + _this.margin.top + ")");
              node.append("rect").attr("id", "bubble-background").attr("width", width).attr("height", height).on("click", clear);
              label = d3.select(this).selectAll("#bubble-labels").data([data]).enter().append("div").attr("id", "bubble-labels");
              update();
              hashchange();
              return d3.select(window).on("hashchange", hashchange);
            });
          };
          /**@function chart.jitter() adjusts jitter attribute
           * @param _ js identifier
           */
          chart.jitter = function(_) {
            if (!arguments.length) {
              return jitter;
            }
            jitter = _;
            force.start();
            return chart;
          };
          /**@function chart.height() adjusts height attribute
           * @param _ js identifier
           */
          chart.height = function(_) {
            if (!arguments.length) {
              return height;
            }
            height = _;
            return chart;
          };
          /**@function chart.width() adjusts width attribute
           * @param _ js identifier
           */
          chart.width = function(_) {
            if (!arguments.length) {
              return width;
            }
            width = _;
            return chart;
          };
          /**@function chart.r() adjusts r attribute
           * @param _ js identifier
           */
          chart.r = function(_) {
            if (!arguments.length) {
              return rValue;
            }
            rValue = _;
            return chart;
          };
          return chart;
        };
        /**@function root.plotData() creates the visualization
         * @param selector contains #vis which is for d3
         * @param data contains data from the csv files
         * @param plot calls Bubbles() 
         */root.plotData = function(selector, data, plot) {
          return d3.select(selector).datum(data).call(plot);
        };
        $(function() {/*calls root.plotdata*/
          var display, key, plot, text;
          plot = Bubbles();
          /*@function*/display = function(data) {
            return root.plotData("#vis", data, plot);
          };
          key = decodeURIComponent(location.search).replace("?", "");
          text = _this.list_of_data.filter(function(t) {
            return t.key === key;
          })[0];
          if (!text) {
            text = _this.list_of_data[0];
          }
          $("#text-select").val(key);
          d3.select("#jitter").on("input", function() {
            return plot.jitter(parseFloat(this.output.value));
          });
          d3.select("#text-select").on("change", function(e) {
            key = $(this).val();
            location.replace("#");
            return location.search = encodeURIComponent(key);
          });
          d3.select("#book-title").html(text.name);
          return d3.csv("data/" + text.file, display);
        });
      
      }
}
/**@const bubl object of class bub which calls the function main() to get the visualization up and running
 */
const bubl = new bub([
    {key: "ave",file: "Avengers.csv",name: "The Avengers"},/*<option value="ave">The Avengers</option>*/
    {key: "end", file: "Endgame.csv",name: "Endgame" },/*<option value="ultron">Age of Ultron</option>*/
    {key: "ultron",file: "Ultron.csv",name: "Age of Ultron"},/*<option value="ultron">Age of Ultron</option>*/
    {key: "iw", file: "IW.csv",name: "Infinity War"},/*<option value="end">Endgame</option>*/
    {key: "ov",file: "Overall.csv",name: "Overall"}],/*<option value="ov">Overall</option>*/
    80,2,12,{ top: 5,right: 0,bottom: 0,left: 0},420,980,0.5,7);
bubl.main();