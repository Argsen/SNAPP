
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
foreach ($all_forum as $key => $value) {
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
        <link rel="stylesheet" type="text/css" href="css/jquery.dataTables.min.css">
        <link rel="stylesheet" type="text/css" href="css/snapp_iframe.css">
        <link rel="stylesheet" type="text/css" href="css/styles.css">

    </head>
    <body>

    <section>
        <div class="container">
            <div class="row">
                <article>
                    <h4>Social Networks Adapting Pedagogical Practice (SNAPP) version of D3</h4>
                    <div class='tabs tabs_default'>
                        <ul class='horizontal'>
                            <li><a href="#tab-1" id="snapp_visualisation">Visualisation</a></li>
                            <li><a href="#tab-2">Statistics</a></li>
                            <!-- <li><a href="#tab-3" id="snapp_network_centrality">Network Centrality</a></li> -->
                            <!-- <li><a href="#tab-4">Help</a></li> -->
                            <li><a href="#tab-5">Credits</a></li>
                        </ul>
                        <div id='tab-1' style="height: 1300px;">
                            <section class="snapp_introduction">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-sm-6" style="font-weight: bold;font-size: larger;">
                                            <p>Current course :</p>
                                            <p id="snapp_course_name">{{current course name}}</p>
                                        </div>
                                        <div class="col-sm-6">
                                            <p>Forum</p>
                                            <select id="snapp_forum_options">
                                            </select>
                                        </div> 
                                        <div class="col-sm-4">
                                            <button id="snapp_create_visualisation" style="display:none">Create Graph</button>
                                        </div>
                                        <!-- <div class="col-sm-12">
                                            <svg width="900" height="600"></svg>
                                        </div> -->
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <br>
                                            <section>
                                                <div class="container-fluid">
                                                    <div class="row">
                                                        <div class="col-sm-4">
                                                        </div>
                                                        <div class="col-sm-4">
                                                            <button id="snapp_load_network_centrality_chart">Load network centrality overview</button>
                                                        </div>
                                                        <div class="col-sm-4">
                                                        </div>
                                                    </div>
                                                    <br>
                                                    <div class="row">
                                                        <div class="col-sm-3">
                                                            <button id="snapp_degree_btn">Degree</button>
                                                        </div>
                                                        <div class="col-sm-3">
                                                            <button id="snapp_closeness_btn">Closeness</button>
                                                        </div>
                                                        <div class="col-sm-3">
                                                            <button id="snapp_betweenness_btn">Betweenness</button>
                                                        </div>
                                                        <div class="col-sm-3">
                                                            <button id="snapp_eigenvector_btn">Eigenvector</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>
                                                <div class="container-fluid">
                                                    <div class="row">
                                                        <div class="col-sm-12">
                                                            <div id="canvas_details"></div>
                                                            <div class="description" id="description_details"># : Centrlity details</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>
                                                <div class="container-fluid overview-wrap">
                                                    <div class="row">
                                                        <br>
                                                        <div class="col-sm-12">
                                                            <table class="table">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">Average clustering</th>
                                                                        <th scope="col">Transitivity</th>
                                                                        <th scope="col">Density</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td id="snapp_iframe_average_clustering"></td>
                                                                        <td id="snapp_iframe_transitivity"></td>
                                                                        <td id="snapp_iframe_density"></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>
                                                <div class="container-fluid overview-wrap">
                                                    <div class="row">
                                                        <div class="col-sm-12">
                                                            <ul>
                                                                <li>
                                                                    <b>Average clustering: </b> the clustering coefficient of an individual node is equal to the proportion
                                                                    of possible triangle through that node that actually exist (where a triangle is defined by three
                                                                    mutually linked nodes). Human social networks demonstrate high clustering since, as a rule, one's
                                                                    friends are more likely to be friends with each other than with randomly chosen person.
                                                                </li>
                                                                <li>
                                                                    <b>Transitivity: </b> the proportion of all possible triangles between nodes that are actually present.
                                                                    Closely related to clustering, for obvious reasons.
                                                                </li>
                                                                <li>
                                                                    <b>Density: </b> the proportion of all possible links that are actually present. Human social networks
                                                                    tend to exhibit quite low density because of practical limits on the number of people any one
                                                                    person can know or befriend.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>
                                                <div class="container-fluid detail-wrap">
                                                    <h4 id="snapp_tab_3_table_title"></h4>
                                                    <table class="table">
                                                        <tbody id="snapp_tab_3_table">

                                                        </tbody>
                                                    </table>
                                                </div>
                                                <br>
                                                <div class="container-fluid detail-wrap">
                                                    <div class="row">
                                                        <div class="col-sm-12">
                                                            <ul>
                                                                <li>
                                                                    <b>Degree Centrality:</b> simply the number of connections possessed by each node. Analogous to a person's raw
                                                                    popularity in a human social network.
                                                                </li>
                                                                <li>
                                                                    <b>Closeness Centrality:</b> distance between nodes is defined by the shortest path between them (in terms of
                                                                    number of discrete links). The closeness centrality of a node is equal to 1/(sum of distances to all other
                                                                    nodes).
                                                                </li>
                                                                <li>
                                                                    <b>Betweenness Centrality:</b> is equal to the proportion of all shortest paths between nodes that pass through
                                                                    a particular node. Can be a valuable property in human social networks because people can leverage their
                                                                    connection to different groups a variety of ways.
                                                                </li>
                                                                <li>
                                                                    <b>Eigenvector Centrality:</b> is a bit more complicated to compute (see link above), but is based on the intuition
                                                                    that an central node is one that is connected to other central nodes. Closely related toalgorithms used by Google and others to sort search results. This measure may not work for very small
                                                                    networks, so try building up a reasonably sized network before clicking this button.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                            <br>
                                            <br>
                                            <section>

                                            </section>
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
                                            <h5>
                                                Participants : <span id="snapp_statistics_participants"></span>
                                            </h5>
                                        </div>
                                        <div class="col-sm-6">
                                            <h5>
                                                Total posts : <span id="snapp_statistics_total_posts"></span>
                                            </h5>
                                        </div>

                                    </div>
                                </div>

                                <table id="snapp_table" class="display" cellspacing="0" width="100%">
                                </table>
                            </section>
                        </div>
                        <div id='tab-3'>
                            <section class="snapp_introduction" id="snapp_tab_3_section">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <h4>Please press "Load network centrality chart" to load</h4>
                                        </div>
                                        <div class="col-sm-12">
                                            <iframe src="./iframe/tab3.html" id="snapp_iframe" frameborder="0" scrolling="no">

                                            </iframe>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
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
                                    <a href="" target="_blank">Visit the 'Seeing Networks' website for more information of SNAPP.</a>
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
                                <p>SNAPP was initially developed from an Australian Learning and Teaching Council funded research project: "'Seeing' networks: Visualising and evaluating student learning networks". The following have made substantial contributions to SNAPP:
                                </p>
                                <ul>
                                    <li>Professor Shane Dawson</li>
                                    <li>Dr Aneesha Bakharia</li>
                                    <li>Mr An Zhao </li>
                                    <li>Associate Professor Jing Gao</li>
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
    <script src="js/lib/jsnetworkx.js"></script>  

    <!-- datatable  export-->
    <script type="text/javascript" src="js/lib/datatables/dataTables.tableTools.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables/copy_csv_xls_pdf.swf"></script>
    <script type="text/javascript" src="js/lib/datatables/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables/dataTables.buttons.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables/buttons.flash.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables/jszip.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables/pdfmake.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables/vfs_fonts.js"></script>
    <script type="text/javascript" src="js/lib/datatables/buttons.html5.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables/buttons.print.min.js"></script>

    <!-- custom javascript -->
    <script src="js/index.js"></script> 
    <script src="js/lib/d3.min.js"></script>
    <script src="js/lib/jsnetworkx.js"></script>
    <script src="js/snapp_func.js"></script>
    <script src="js/graph.js"></script>
    <script>

        /*------ global ------*/
        var forums_data = <?php echo $forums; ?>;
        var graph_json = <?php echo $json; ?>;
        var course_info = <?php echo $course_info; ?>;
        var forum_choose_id = -1;
        var dataTable;
        var cal_degree = function(G){

            var snapp_degree = jsnx.degree(G);
            var return_arr = [];

            for (var [key, value] of snapp_degree.entries()) {
                var temp = {
                    "source": "",
                    "centrality": 0
                };
                temp.source = key;
                temp.centrality = value;

                return_arr.push(temp);
            }

            return return_arr;

        };

        var cal_closeness = function(G){

            var snapp_closeness = jsnx.allPairsShortestPathLength(G);

            var re_arrange_arr = [];

            for (var [key, value] of snapp_closeness.entries()) {

                var item = {
                    "source": "",
                    "centrality": 0
                };

                var sum = 0;

                value.forEach(function (item, key, mapObj) {
                    sum += item;
                });

                var centrality = 0;

                if(sum != 0){
                    var centrality = 1.0 / sum;
                }

                item.source = key;
                item.centrality = centrality;

                re_arrange_arr.push(item);
            }

            return re_arrange_arr;

        };

        var cal_betweenness = function(G){
            
            var snapp_betweenness_centrality = jsnx.betweennessCentrality(G);
            var return_arr = [];

            for (var [key, value] of snapp_betweenness_centrality.entries()) {
                var temp = {
                    "source": "",
                    "centrality": 0
                };
                temp.source = key;
                temp.centrality = value;

                return_arr.push(temp);
            }

            return return_arr;

        };

        var cal_eigenvector = function(G){
            
            var snapp_eigenvector_centrality = jsnx.eigenvectorCentrality(G);
            var return_arr = [];
            
            for (var [key, value] of snapp_eigenvector_centrality.entries()) {
                var temp = {
                    "source": "",
                    "centrality": 0
                };
                temp.source = key;
                temp.centrality = value;

                return_arr.push(temp);
            }

            return return_arr;
        };
        
        /*------ course info name ------*/
        $("#snapp_course_name").text("");
        $("#snapp_course_name").text(course_info.fullname);

        /*------ structure select ------*/
        /*------ add All option ------*/
        $("#snapp_forum_options").empty();
        var option = "<option value='' id='all-value'> All </option>";
        $("#snapp_forum_options").append(option);

        for(var item in forums_data){
            var option = "<option value='" + item + "'>" + forums_data[item] + "</option>";
            $("#snapp_forum_options").append(option);
            $("#all-value").val(item + "-" + $("#all-value").val());
        }

        /*------ bind event ------*/
        $("#snapp_create_visualisation").on("click", function(){

            /*------ judge all option & others ------*/
            var is_all_option = $("#snapp_forum_options").val().indexOf("-") !== -1 ? true : false;

            if(is_all_option){

                var forum_id_array = $("#snapp_forum_options").val().split("-");
                /*------ pop out last redundancy ------*/
                forum_id_array.pop();
                forum_choose_id = forum_id_array;

                var parent_json = graph_json;
                var id_list = forum_choose_id;
                var all_json = [];

                for(var i = 0; i < id_list.length ; i++){

                    var jsondata = JSON.parse(JSON.stringify(parent_json[id_list[i]]));

                    if(all_json.length === 0){
                        //calculate 0
                        all_json[0] = jsondata[0];
                    
                        //calculate 1
                        all_json[1] = jsondata[1];
            
                        //calculate 2
                        all_json[2] = jsondata[2];
                    }else{
                        
                        for(var item in jsondata[0]){
                            //calculate 0

                            if(typeof(all_json[0][item]) === "undefined"){
                                all_json[0][item] = jsondata[0][item];
                            }else{
                                all_json[0][item]["size"] +=  jsondata[0][item]["size"];
                                all_json[0][item]["reply"] +=  jsondata[0][item]["reply"];
                            }
                                
                        }

                        for(var item in jsondata[1]){
                            //calculate 1

                            if(typeof(all_json[1][item]) === "undefined"){
                                all_json[1][item] = jsondata[1][item];
                            }else{
                                all_json[1][item] += jsondata[1][item];
                            }
                        
                        }

                        for(var item in jsondata[2]){
                            //calculate 2

                            if(typeof(all_json[2][item]) === "undefined"){
                                all_json[2][item] = jsondata[2][item];
                            }else{
                                all_json[2][item] += jsondata[2][item];
                            }

                        }

                    }

                }

                var G = new jsnx.Graph();
        
                for (var item in all_json[0]) {
                    G.addNode(item, { count: all_json[0][item].size, color: 'yellow', label: all_json[0][item].name });
                }
            
                var edges_arr = []
                for (var item in all_json[1]) {
                    var source = item.split("_")[0];
                    var target = item.split("_")[1];
            
                    G.addEdge(source, target);
                }

                var degree = cal_degree(G);
                var closeness = cal_closeness(G);
                var betweenness = cal_betweenness(G);
                var eigenvector = cal_eigenvector(G);

                var table_record = [];

                for (var item of degree) {

                    var temp = [];

                    temp.push(all_json[0][item.source].name);
                    temp.push(Number(item.centrality).toFixed(2))

                    for (var items of closeness) {

                        if(items.source === item.source){
                            temp.push(Number(items.centrality).toFixed(2));
                        }

                    }

                    for (var items of betweenness) {

                        if(items.source === item.source){
                            temp.push(Number(items.centrality).toFixed(2));
                        }
                
                    }

                    for (var items of eigenvector) {

                        if(items.source === item.source){
                            temp.push(Number(items.centrality).toFixed(2));
                        }
                
                    }

                    table_record.push(temp);
                }

                /*------ table ------*/
                if(typeof(dataTable) === 'undefined'){
                    
                    dataTable = $('#snapp_table').DataTable({
                                                            data: table_record,
                                                            columns: [
                                                                { title: "Name" },
                                                                { title: "Degree" },
                                                                { title: "Closeness" },
                                                                { title: "Betweenness" },
                                                                { title: "Eigenvector" },
                                                            ],
                                                            dom: 'Bfrtip',
                                                            buttons: ['copy','csv','excel','pdf','print']
                                                        });
                }else{

                    if(table_record.length > 0){
                        $('#snapp_table').DataTable().clear().draw();
                        for(var i = 0; i < table_record.length; i++){
                            $('#snapp_table').DataTable().row.add(table_record[i]).draw();
                        }
                    }else{
                        $('#snapp_table').DataTable().clear().draw();
                        $('#snapp_table').DataTable().row.add(["", "", "", ""]).draw();
                    }

                    
                } 

            }else{

                var forum_id = $("#snapp_forum_options").val();

                forum_choose_id = forum_id;

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

                /*------ update statistics tab ------*/
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

                /*
                var connect_arr = temp[1];
                var table_record = [];

                var trigger = false;
                var trigger_temp_source = "";

                for(var item in connect_arr){
                    var key = item;
                    var value = connect_arr[item];

                    var source = key.split("_")[0];
                    var target = key.split("_")[1];
                    
                    if(source === trigger_temp_source){
                        trigger = false;
                    }else{
                        trigger = true;
                    }

                    if(trigger){
                        var record = {
                        "name": "",
                        "degree": 0,
                        "in_degree": 0,
                        "out_degree": 0
                        };

                        var data = [];
                        
                        record.name = temp[0][source].name;
                        var in_degree_total = 0;
                        var out_degree_total = 0;

                        for(var connect in temp[1]){

                            if(connect.indexOf(source + "_") > -1){
                                out_degree_total += parseInt(temp[1][connect]);
                            }

                            if(connect.indexOf("_" + source) > -1){
                                in_degree_total += parseInt(temp[1][connect]);
                            }

                        }

                        record.in_degree = in_degree_total;
                        record.out_degree = out_degree_total;
                        record.degree = in_degree_total + out_degree_total;

                        data.push(temp[0][source].name);
                        data.push(in_degree_total + out_degree_total);
                        data.push(in_degree_total);
                        data.push(out_degree_total);

                        trigger_temp_source = source;

                        table_record.push(data);

                    }

                    console.log(table_record);

                    
                }
                */

                var parent_json = graph_json;
                var json = parent_json[forum_choose_id];
            
                var G = new jsnx.Graph();
            
                for (var item in json[0]) {
                    G.addNode(item, { count: json[0][item].size, color: 'yellow', label: json[0][item].name });
                }
            
                var edges_arr = []
                for (var item in json[1]) {
                    var source = item.split("_")[0];
                    var target = item.split("_")[1];
            
                    G.addEdge(source, target);
                }

                var degree = cal_degree(G);
                var closeness = cal_closeness(G);
                var betweenness = cal_betweenness(G);
                var eigenvector = cal_eigenvector(G);

                var table_record = [];

                for (var item of degree) {

                    var temp = [];

                    temp.push(json[0][item.source].name);
                    temp.push(Number(item.centrality).toFixed(2))

                    for (var items of closeness) {

                        if(items.source === item.source){
                            temp.push(Number(items.centrality).toFixed(2));
                        }

                    }

                    for (var items of betweenness) {

                        if(items.source === item.source){
                            temp.push(Number(items.centrality).toFixed(2));
                        }
                
                    }

                    for (var items of eigenvector) {

                        if(items.source === item.source){
                            temp.push(Number(items.centrality).toFixed(2));
                        }
                
                    }

                    table_record.push(temp);
                }

                /*------ table ------*/
                if(typeof(dataTable) === 'undefined'){
                    
                    dataTable = $('#snapp_table').DataTable({
                                                            data: table_record,
                                                            columns: [
                                                                { title: "Name" },
                                                                { title: "Degree" },
                                                                { title: "In degree" },
                                                                { title: "Out degree" }
                                                            ]
                                                        });
                }else{

                    if(table_record.length > 0){
                        $('#snapp_table').DataTable().clear().draw();
                        for(var i = 0; i < table_record.length; i++){
                            $('#snapp_table').DataTable().row.add(table_record[i]).draw();
                        }
                    }else{
                        $('#snapp_table').DataTable().clear().draw();
                        $('#snapp_table').DataTable().row.add(["", "", "", ""]).draw();
                    }

                    
                } 

            }
 
            
        });

        $("#snapp_forum_options").on("change", function(){
            $("#snapp_create_visualisation").trigger("click");
        });

        $(document).ready(function(){
            /*------ trigger init statue ------*/
            $("#snapp_forum_options").trigger("change");
            $("#snapp_create_visualisation").trigger("click");

            $(".overview-wrap").each(function(){
                $(this).hide();
            });
            $(".detail-wrap").each(function(){
                $(this).hide();
            });

        });

        function resizeIframe(obj) {
            obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
        }

    </script>
    <script src="js/tab_iframe.js"></script>
    </body>
</html>