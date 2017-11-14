
<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package   snapp
 * @copyright 2017, Max Gong <max.gong@unisa.edu.au>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once("../../config.php");
require("lib.php");
// require('javascriptfunctions.php');
global $DB;

$courseid = required_param('id', PARAM_INT);
// require_login($courseid);

/*------ get course name ------*/
$course = get_course($courseid);
$course_info = json_encode($course);

/*------ search all related course forum ------*/
$all_forum = snapp_get_forumoptions($courseid);
$forums = array(); 
$forums = json_encode($all_forum);

$result = array();
foreach($all_forum as $key => $value) {
    // print "$key => $value\n";
    /*------ search forum graph ------*/
    $node_json = snapp_get_d3_json(intval($key));

    $result[$key] = $node_json;
    
}

$json = json_encode($result);

// echo $course_info;
// echo $forums;
// echo $json;

?>

<html>
    <head>
        <meta charset=utf-8>
        <title><?php echo get_string('snapp', 'block_snapp'); ?></title>
        <link rel="stylesheet" type="text/css" href="css/normalize.css">
        <link rel="stylesheet" type="text/css" href="css/skeleton.css">
        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="css/jquery.dataTables.min.css" />
        <link rel="stylesheet" type="text/css" href="css/styles.css" />

    </head>
    <body>

    <section>
        <div class="container">
            <div class="row">
                <article>
                    <h4>Social Networks Adapting Pedagogical Practice (SNAPP) version of D3</h4>
                    <div class='tabs tabs_default'>
                        <ul class='horizontal'>
                            <li><a href="#tab-1">Visualisation</a></li>
                            <li><a href="#tab-2">Statistics</a></li>
                            <li><a href="#tab-3">Network Centrality</a></li>
                            <li><a href="#tab-4">Help</a></li>
                            <li><a href="#tab-5">Credits</a></li>
                        </ul>
                        <div id='tab-1'>
                            <section class="snapp_introduction">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <p>Current course :</p>
                                            <p id="snapp_course_name">{{current course name}}</p>
                                        </div>
                                        <div class="col-sm-4">
                                            <p>Forum</p>
                                            <select id="snapp_forum_options">
                                            </select>
                                        </div>
                                        <div class="col-sm-4">
                                            <br>
                                            <button id="snapp_create_visualisation">Create Graph</button>
                                        </div>
                                        <div class="col-sm-12">
                                            <svg width="900" height="600"></svg>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div id='tab-2'>
                            <section class="snapp_introduction">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <h4>
                                                Participants : <span id="snapp_statistics_participants">{{number}}</span>
                                            </h4>
                                        </div>
                                        <div class="col-sm-6">
                                            <h4>
                                                Total posts : <span id="snapp_statistics_total_posts">{{number}}</span>
                                            </h4>
                                        </div>

                                    </div>
                                </div>

                                <table id="example" class="display" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Degree</th>
                                            <th>In Degree</th>
                                            <th>Out Degree</th>
                                        </tr>
                                    </thead>
                                    <tbody id= "snapp_table">
                                        <tr>
                                            <td>Tiger Nixon</td>
                                            <td>System Architect</td>
                                            <td>Edinburgh</td>
                                            <td>61</td>
                                        </tr>
                                        <tr>
                                            <td>Garrett Winters</td>
                                            <td>Accountant</td>
                                            <td>Tokyo</td>
                                            <td>63</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                        </div>
                        <div id='tab-3'><span>Tab 3</span></div>
                        <div id='tab-4'>
                            <section class="snapp_introduction">
                                <h3>What is SNAPP?</h3>
                                SNAPP allows users to visualize interactions resulting from discussion forum posts and replies. The network visualisations
                                of forum interactions provide an opportunity for teachers to rapidly identify patterns of user behaviour - at any stage of
                                course progression.&nbsp; SNAPP has been developed to extract discussion forum user interactions from various commercial
                                and open source learning management systems. SNAPP currently supports Blackboard, WebCT and Moodle and runs within Internet
                                Explorer, Firefox and Safari on both PC and Mac computers.
                                <br>
                                <br>
                                <div style="text-align: center;">
                                    <a href="http://research.uow.edu.au/learningnetworks/seeing/about/index.html" target="_blank">Visit the 'Seeing Networks' website for more information of SNAPP.</a>
                                </div>
                                <h3>Visualisation</h3>
                                The "Visualisation" tab renders a social network diagram from the extracted forum interactions.&nbsp;Social network visualisations
                                provide a snapshot of who is communicating with whom and to what level. A network diagram of your students' discussions online
                                can:
                                <br>
                                <ul>
                                    <li>identify disconnected (at risk) students</li>
                                    <li>identify key information brokers within your class</li>
                                    <li>identify potentially high and low performing students so you can plan interventions before you even mark their work</li>
                                    <li>indicate the extent to which a learning community is developing in your class</li>
                                    <li>provide you with a "before and after" snapshot of what kinds of interactions happened before and after you intervened/
                                        changed your learning activity design (useful to see what effect your changes have had on student interactions and
                                        for demonstrating reflective teaching practice e.g. through a teaching portfolio)</li>
                                    <li>allow your students to benchmark their performance without the need for marking</li>
                                </ul>
                                Each person/participant is represented by a node, and interactions between participants are replresented by a line (connection
                                which aggregates the number of posts made between two nodes).
                                <strong>
                                    <br>
                                    <br> Controls:
                                </strong>
                                <br>
                                <br> You can
                                <strong>zoom in</strong> and
                                <strong>zoom out
                                </strong> of the diagram using zoom in/ zoom out and the mouse wheel (if "mouse wheel zoom" checkbox is selected).
                                <br>
                                <br> Two
                                <strong>selection modes</strong> are available: transforming and picking.
                                <strong>Transforming</strong>
                                allows you to move the diagram in the visible window.
                                <strong>Picking</strong>
                                allows you to select individual nodes (representing individual people) and move them - for example, to see them better and/or
                                to make the diagram easier to view.
                                <br>
                                <br> Various
                                <strong>layout</strong> algorithms are available. Select a layout from the dropdown box and the social graph will be rendered using
                                the selected algorithm.
                                <br>
                                <strong>Hovering</strong> over a node/person displays the number of posts as well as indegree and outdegree values.
                                <br/>
                                <strong>Hovering</strong> over a connection displays the no of replies made between two participants.
                                <br>
                                <br>
                                <strong>Filter:</strong>
                                <br>
                                <br> SNAPP allows the social graph to be filtered based upon the number of connections between people or participants. The
                                <strong>Enable Filtering
                                </strong> checkbox must be checked to see graph updates as a result of changing filtering criteria. Social interactions can
                                be filtered based on whether the connections of a person are greater than or less than a numeric value.
                                <br>
                                <br>
                                <strong>People:</strong>
                                <br>
                                <br> You will usually see individual's names by default, but if you want to hide the names (as per the example shown), you can
                                deselect the
                                <strong>"Show Names"
                                </strong> checkbox.
                                <br>
                                <br> The
                                <strong>"Scale Nodes by Number of Posts"</strong> option allows you to turn off and on whether you view the numbers of interactions
                                an individual in the network diagram has via the size of their node (round ball representing the individual).&nbsp; When
                                this selection is on (as it is by default), a larger node represents an individual with more interactions in the network
                                diagram.&nbsp; This is an easy way to identify the amount of activity from individuals in the network.
                                <br>
                                <br>
                                <strong>Connections:</strong>
                                <br>
                                <br> The "
                                <strong>Show Posts between Participants</strong>" option, shows or hides the numbers of posts along the connecting lines in the diagram.
                                <br>
                                <br> The
                                <strong>"Scale Connections by Number of Posts"</strong>
                                option, thickens connecting lines according to the amount of posts made.
                                <h3>Statistics</h3>
                                The "Statistics" tab displays a "posting frequency" table. This table lists the number of posts and replies to posts made
                                by each individual. Click on either the "Name" or "No Posts" table headers to re-order the participants by either name or
                                the number of posts they have made. A search is provide to help locate participants.
                                <h3>Export</h3>
                                Extracted forum interactions are available for export in both the .vna and the graphml formats. The .vna format is used by
                                <a href="http://www.analytictech.com/downloadnd.htm">NetDraw</a>, a popular social network analysis tool available for the PC. Within NetDraw, additional social network metrics
                                and visualisations are available.
                                <br>
                                <br>
                                <strong>Saving exported data to the .vna format:</strong>
                                <br>
                                <ol>
                                    <li>Hightlight and copy all of the text in the VNA file format textarea (Ctrl+C).&nbsp;</li>
                                    <li>Open Notepad and paste text into Notepad (Ctrl+V).</li>
                                    <li>Save the file with a .vna file extension. NetDraw can be used to open the .vna file format.</li>
                                </ol>
                                <br>
                            </section>
                        </div>
                        <div id='tab-5'>
                            <section class="snapp_introduction">
                                <h3>Credits</h3>
                                <p>SNAPP has been developed as part of  a joint project, "'Seeing' networks: Visualising and evaluating student learning networks" - 
                                an Australian Learning and Teaching Council funded project focused towards the development of ICT mediated data visualisation resources.  
                                The project includes both National and International research partners:</p>
                                <ul>
                                    <li>University of Wollongong (Lead Institution) - Dr Shane Dawson and Associate Professor Lori Lockyer</li>
                                    <li>RMIT University - Professor Phil Poronnik</li>
                                    <li>Murdoch University - Associate Professor Rob Phillips</li>
                                    <li>The University of Queensland - Professor Phil Long and Ms Aneesha Bakharia</li>
                                    <li>University of British Columbia (Canada) - Dr Leah Macfadyen, Dr Michelle Lamberson and Associate Professor Gary Poole</li>
                                </ul>   
                                <em>Cite as:</em> Dawson, S., Bakharia, A., & Heathcote, E. (2010). SNAPP: Realising the affordances of real-time SNA within networked learning environments. Paper presented at the Networked Learning Conference 2010, Aalborg, Denmark.
                                <br>
                            <section>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
    
    <!-- JQuery -->
    <script src="js/lib/jquery-2.1.0.min.js"></script>
    <script>window.jQuery || document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"><\/script>')</script>

    <!-- javascript lib -->
    <script src="js/lib/bootstrap.min.js"></script>  
    <script src="js/lib/jquery.tabslet.min.js"></script>  
    <script src="js/lib/modernizr.custom.js"></script>  
    <script src="js/lib/jquery.dataTables.min.js"></script>  

    <!-- custom javascript -->
    <script src="js/index.js"></script> 
    <script src="js/lib/d3.v4.min.js"></script> 
    <script src="js/snapp_func.js"></script>
    <script src="js/graph.js"></script>
    <script>
        var forums_data = <?php echo $forums; ?>;
        var graph_json = <?php echo $json; ?>;
        var course_info = <?php echo $course_info; ?>;
        
        /*------ course info name ------*/
        $("#snapp_course_name").text("");
        $("#snapp_course_name").text(course_info.fullname);

        /*------ structure select ------*/
        $("#snapp_forum_options").empty();
        for(var item in forums_data){
            var option = "<option value='" + item + "'>" + forums_data[item] + "</option>";
            $("#snapp_forum_options").append(option);
        }

        /*------ bind event ------*/
        $("#snapp_create_visualisation").on("click", function(){
            var forum_id = $("#snapp_forum_options").val();

            var temp = {};
            temp = graph_json[forum_id];

            /*------ re-structure data ------*/
            var temp_graph = {
                "nodes": [
                ],
                "links": [
                ]
            }

            /*------ append node ------*/
            for(var item in temp[0]){
                var nodes_temp = {"id": "", "group": 0, "value": 0};
                nodes_temp.id = temp[0][item].name;
                nodes_temp.group = parseInt(temp[0][item].group);
                nodes_temp.value = parseInt(temp[0][item].size);

                temp_graph.nodes.push(nodes_temp);
            }

            /*------ append links ------*/
            for(var item in temp[1]){
                var links_temp = { "source": "", "target": "", "value": 0 };

                var source_temp = temp[0][item.split("_")[0]].name;
                var target_temp = temp[0][item.split("_")[1]].name;

                links_temp.source = source_temp;
                links_temp.target = target_temp;
                links_temp.value = parseInt(temp[1][item]);

                temp_graph.links.push(links_temp);

            }

            /*------ create d3 drawing ------*/

            graph = temp_graph;

            d3.selectAll("svg > *").remove();

            var svg = d3.select("svg"),
                width = +svg.attr("width"),
                height = +svg.attr("height");

            var color = d3.scaleOrdinal(d3.schemeCategory20);

            var nd;
            for (var i = 0; i < graph.nodes.length; i++) {
                nd = graph.nodes[i];
                nd.rx = nd.id.length * 4.5;
                nd.ry = 12;
            }

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function (d) { return d.id; }))
                .force("collide", d3.ellipseForce(6, 0.5, 5))
                .force("center", d3.forceCenter(width / 2, height / 2));

            //todo: modify to direction graph
            /*------ build a arrow to use ------*/
            svg.append("svg:defs").selectAll("marker")
                .data(["end"])
                .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 35)
                .attr("refY", -1.5)
                .attr("markerWidth", 9)
                .attr("markerHeight", 9)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");

            var link = svg.append("g")
                .attr("class", "link")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .style("stroke", "#BCBBB6")
                .attr("marker-end", "url(#end)")
            // .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

            var node = svg.append("g")
                .attr("class", "node")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("r", function (d) { return Math.sqrt(d.value) * 10; })
                .attr("rx", function (d) { return d.rx; })
                .attr("ry", function (d) { return d.ry; })
                .style("stroke", "#BCBBB6")
                .style("stroke-width", "3px")
                .attr("fill", function (d) { return color(d.group); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            var text = svg.append("g")
                .attr("class", "labels")
                .selectAll("text")
                .data(graph.nodes)
                .enter().append("text")
                .attr("dy", 2)
                .attr("text-anchor", "middle")
                .text(function (d) { return d.id })
                .attr("fill", "black");


            simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(graph.links);

            function ticked() {
                link
                    .attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });

                node
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; });
                text
                    .attr("x", function (d) { return d.x; })
                    .attr("y", function (d) { return d.y; });

            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

           /*------ update statistics tab ------*/

           console.log(temp);
           var participants = 0;
           for(var item in temp[0]){
            participants++;
           }

           var total_posts = 0;
           for(var item in temp[0]){
            total_posts += temp[0][item].reply;
           }

           $("#snapp_statistics_participants").text("");
           $("#snapp_statistics_participants").text(participants);

           $("#snapp_statistics_total_posts").text("");
           $("#snapp_statistics_total_posts").text(total_posts);

           //todo:


            
        });


    </script>

    </body>
</html>