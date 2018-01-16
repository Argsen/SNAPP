/**
 * @file: tab_iframe.js
 * @author: Max Gong <max.g.laboratory@gmail.com>
 */

/*------ three overview various ------*/
var size = 1;
var distance = 1;

$("#snapp_load_network_centrality_chart").on("click", function () {

    $(".overview-wrap").each(function () {
        $(this).show();
    });
    $(".detail-wrap").each(function () {
        $(this).hide();
    });

    var is_all = typeof (get_parent_forum_id()) === "object" ? true : false;

    if (is_all) {

        var parent_json = get_parent_graph_json();
        var id_list = get_parent_forum_id();
        var all_json = [];

        for (var i = 0; i < id_list.length; i++) {

            var jsondata = JSON.parse(JSON.stringify(parent_json[id_list[i]]));

            if (all_json.length === 0) {
                //calculate 0
                all_json[0] = jsondata[0];

                //calculate 1
                all_json[1] = jsondata[1];

                //calculate 2
                all_json[2] = jsondata[2];
            } else {

                for (var item in jsondata[0]) {
                    //calculate 0

                    if (typeof (all_json[0][item]) === "undefined") {
                        all_json[0][item] = jsondata[0][item];
                    } else {
                        all_json[0][item]["size"] += jsondata[0][item]["size"];
                        all_json[0][item]["reply"] += jsondata[0][item]["reply"];
                    }

                }

                for (var item in jsondata[1]) {
                    //calculate 1

                    if (typeof (all_json[1][item]) === "undefined") {
                        all_json[1][item] = jsondata[1][item];
                    } else {
                        all_json[1][item] += jsondata[1][item];
                    }

                }

                for (var item in jsondata[2]) {
                    //calculate 2

                    if (typeof (all_json[2][item]) === "undefined") {
                        all_json[2][item] = jsondata[2][item];
                    } else {
                        all_json[2][item] += jsondata[2][item];
                    }

                }

            }

        }

        var G = new jsnx.Graph();

        for (var item in all_json[0]) {
            G.addNode(item, { count: 25, color: 'red', label: all_json[0][item].name });
        }

        var edges_arr = []
        for (var item in all_json[1]) {
            var source = item.split("_")[0];
            var target = item.split("_")[1];

            G.addEdge(source, target);
        }

        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count;
                }
            },
            nodeStyle: {
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 220
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        }); //console.log(JSON.stringify(all_json, null, 2));

        all_json = [];


    } else {

        var parent_json = get_parent_graph_json();
        var json = parent_json[get_parent_forum_id()];

        var G = new jsnx.Graph();

        for (var item in json[0]) {
            G.addNode(item, { count: json[0][item].size, color: 'red', label: json[0][item].name });
        }

        var edges_arr = []
        for (var item in json[1]) {
            var source = item.split("_")[0];
            var target = item.split("_")[1];

            G.addEdge(source, target);
        }

        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * 2.5;
                }
            },
            nodeStyle: {
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });

    }

    $("#description_details").text("");
    $("#description_details").text("# : Network Centrality Overview");

    //analysis
    var snapp_average_clustering = jsnx.averageClustering(G).toFixed(2);
    var snapp_transitivity = jsnx.transitivity(G).toFixed(2);
    var snapp_density = jsnx.density(G).toFixed(2);

    $("#snapp_iframe_average_clustering").text("");
    $("#snapp_iframe_average_clustering").text(snapp_average_clustering);
    $("#snapp_iframe_transitivity").text("");
    $("#snapp_iframe_transitivity").text(snapp_transitivity);
    $("#snapp_iframe_density").text("");
    $("#snapp_iframe_density").text(snapp_density);

});

/*------ bind event to four type of Centrality ------*/
$("#snapp_degree_btn").on("click", function () {

    $(".overview-wrap").each(function () {
        $(this).hide();
    });
    $(".detail-wrap").each(function () {
        $(this).show();
    });

    var is_all = typeof (get_parent_forum_id()) === "object" ? true : false;

    if (is_all) {

        var parent_json = get_parent_graph_json();
        var id_list = get_parent_forum_id();
        var all_json = [];

        for (var i = 0; i < id_list.length; i++) {

            var jsondata = JSON.parse(JSON.stringify(parent_json[id_list[i]]));

            if (all_json.length === 0) {
                //calculate 0
                all_json[0] = jsondata[0];

                //calculate 1
                all_json[1] = jsondata[1];

                //calculate 2
                all_json[2] = jsondata[2];
            } else {

                for (var item in jsondata[0]) {
                    //calculate 0

                    if (typeof (all_json[0][item]) === "undefined") {
                        all_json[0][item] = jsondata[0][item];
                    } else {
                        all_json[0][item]["size"] += jsondata[0][item]["size"];
                        all_json[0][item]["reply"] += jsondata[0][item]["reply"];
                    }

                }

                for (var item in jsondata[1]) {
                    //calculate 1

                    if (typeof (all_json[1][item]) === "undefined") {
                        all_json[1][item] = jsondata[1][item];
                    } else {
                        all_json[1][item] += jsondata[1][item];
                    }

                }

                for (var item in jsondata[2]) {
                    //calculate 2

                    if (typeof (all_json[2][item]) === "undefined") {
                        all_json[2][item] = jsondata[2][item];
                    } else {
                        all_json[2][item] += jsondata[2][item];
                    }

                }

            }

        }

        var G = new jsnx.Graph();

        for (var item in all_json[0]) {
            G.addNode(item, { count: all_json[0][item].size, color: 'red', label: all_json[0][item].name });
        }

        var edges_arr = []
        for (var item in all_json[1]) {
            var source = item.split("_")[0];
            var target = item.split("_")[1];

            G.addEdge(source, target);
        }


        var snapp_degree = jsnx.degree(G);

        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Degree")

        var tr = "<tr></tr>";
        for (var i = 0; i < 2; i++) {
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_degree.entries()) {

            var td = "<td>" + all_json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + Number(value).toFixed(2) + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

            /*------ modify G ------*/
            var temp = {};
            temp = G.node.get(key);
            temp.count = Number(value).toFixed(2);
            temp.color = "CadetBlue";
            G.node.set(key, temp);

        }

        /*------ draw Degree centrality ------*/
        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * size;
                }
            },
            nodeStyle: {
                stroke: 'transparent',
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label + " : " + d.data.count;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120 * distance
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });

        all_json = [];

    } else {

        var parent_json = get_parent_graph_json();
        var json = parent_json[get_parent_forum_id()];

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

        var snapp_degree = jsnx.degree(G);

        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Degree")

        var tr = "<tr></tr>";
        for (var i = 0; i < 2; i++) {
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_degree.entries()) {

            var td = "<td>" + json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + Number(value).toFixed(2) + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

            /*------ modify G ------*/
            var temp = {};
            temp = G.node.get(key);
            temp.count = Number(value).toFixed(2);
            temp.color = "CadetBlue";
            G.node.set(key, temp);

        }

        /*------ draw Degree centrality ------*/
        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * size;
                }
            },
            nodeStyle: {
                stroke: 'transparent',
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label + " : " + d.data.count;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120 * distance
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });

    }

    $("#description_details").text("");
    $("#description_details").text("# : Degree Centrality View");
});

$("#snapp_closeness_btn").on("click", function () {

    $(".overview-wrap").each(function () {
        $(this).hide();
    });
    $(".detail-wrap").each(function () {
        $(this).show();
    });

    var is_all = typeof (get_parent_forum_id()) === "object" ? true : false;

    if (is_all) {

        var parent_json = get_parent_graph_json();
        var id_list = get_parent_forum_id();
        var all_json = [];

        for (var i = 0; i < id_list.length; i++) {

            var jsondata = JSON.parse(JSON.stringify(parent_json[id_list[i]]));

            if (all_json.length === 0) {
                //calculate 0
                all_json[0] = jsondata[0];

                //calculate 1
                all_json[1] = jsondata[1];

                //calculate 2
                all_json[2] = jsondata[2];
            } else {

                for (var item in jsondata[0]) {
                    //calculate 0

                    if (typeof (all_json[0][item]) === "undefined") {
                        all_json[0][item] = jsondata[0][item];
                    } else {
                        all_json[0][item]["size"] += jsondata[0][item]["size"];
                        all_json[0][item]["reply"] += jsondata[0][item]["reply"];
                    }

                }

                for (var item in jsondata[1]) {
                    //calculate 1

                    if (typeof (all_json[1][item]) === "undefined") {
                        all_json[1][item] = jsondata[1][item];
                    } else {
                        all_json[1][item] += jsondata[1][item];
                    }

                }

                for (var item in jsondata[2]) {
                    //calculate 2

                    if (typeof (all_json[2][item]) === "undefined") {
                        all_json[2][item] = jsondata[2][item];
                    } else {
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

        var snapp_closeness = jsnx.allPairsShortestPathLength(G);

        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Closeness")

        var tr = "<tr></tr>";
        for (var i = 0; i < 2; i++) {
            $("#snapp_tab_3_table").append(tr);
        }

        /**
         * re-calculated closeness
         * @author: Max Gong<max.g.laboratory@gmail.com>
         */

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

            if (sum != 0) {
                var centrality = 1.0 / sum;
            }

            item.source = key;
            item.centrality = centrality;

            re_arrange_arr.push(item);
        }

        for (var item of re_arrange_arr) {

            var td = "<td>" + all_json[0][item.source].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + Number(item.centrality).toFixed(2) + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

            /*------ modify G ------*/
            var temp = {};
            temp = G.node.get(item.source);
            temp.count = Number(item.centrality).toFixed(2);
            temp.color = "Coral";
            G.node.set(item.source, temp);

        }

        /*------ draw Closeness Centrality ------*/
        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * 10 * size;
                }
            },
            nodeStyle: {
                stroke: 'transparent',
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label + " : " + d.data.count;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120 * distance
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });



    } else {

        var parent_json = get_parent_graph_json();
        var json = parent_json[get_parent_forum_id()];

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

        var snapp_closeness = jsnx.allPairsShortestPathLength(G);

        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Closeness")

        var tr = "<tr></tr>";
        for (var i = 0; i < 2; i++) {
            $("#snapp_tab_3_table").append(tr);
        }

        /**
         * re-calculated closeness
         * @author: Max Gong<max.g.laboratory@gmail.com>
         */

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

            if (sum != 0) {
                var centrality = 1.0 / sum;
            }

            item.source = key;
            item.centrality = centrality;

            re_arrange_arr.push(item);
        }

        for (var item of re_arrange_arr) {

            var td = "<td>" + json[0][item.source].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + Number(item.centrality).toFixed(2) + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

            /*------ modify G ------*/
            var temp = {};
            temp = G.node.get(item.source);
            temp.count = Number(item.centrality).toFixed(2);
            temp.color = "Coral";
            G.node.set(item.source, temp);

        }

        /*------ draw Closeness Centrality ------*/
        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * 10 * size;
                }
            },
            nodeStyle: {
                stroke: 'transparent',
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label + " : " + d.data.count;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120 * distance
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });

    }



    $("#description_details").text("");
    $("#description_details").text("# : Closeness Centrality View");

});

$("#snapp_betweenness_btn").on("click", function () {

    $(".overview-wrap").each(function () {
        $(this).hide();
    });
    $(".detail-wrap").each(function () {
        $(this).show();
    });

    var is_all = typeof (get_parent_forum_id()) === "object" ? true : false;

    if (is_all) {

        var parent_json = get_parent_graph_json();
        var id_list = get_parent_forum_id();
        var all_json = [];

        for (var i = 0; i < id_list.length; i++) {

            var jsondata = JSON.parse(JSON.stringify(parent_json[id_list[i]]));

            if (all_json.length === 0) {
                //calculate 0
                all_json[0] = jsondata[0];

                //calculate 1
                all_json[1] = jsondata[1];

                //calculate 2
                all_json[2] = jsondata[2];
            } else {

                for (var item in jsondata[0]) {
                    //calculate 0

                    if (typeof (all_json[0][item]) === "undefined") {
                        all_json[0][item] = jsondata[0][item];
                    } else {
                        all_json[0][item]["size"] += jsondata[0][item]["size"];
                        all_json[0][item]["reply"] += jsondata[0][item]["reply"];
                    }

                }

                for (var item in jsondata[1]) {
                    //calculate 1

                    if (typeof (all_json[1][item]) === "undefined") {
                        all_json[1][item] = jsondata[1][item];
                    } else {
                        all_json[1][item] += jsondata[1][item];
                    }

                }

                for (var item in jsondata[2]) {
                    //calculate 2

                    if (typeof (all_json[2][item]) === "undefined") {
                        all_json[2][item] = jsondata[2][item];
                    } else {
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

        var snapp_betweenness_centrality = jsnx.betweennessCentrality(G);

        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Betweenness")

        var tr = "<tr></tr>";
        for (var i = 0; i < 2; i++) {
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_betweenness_centrality.entries()) {

            var td = "<td>" + all_json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + Number(value).toFixed(2) + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

            /*------ modify G ------*/
            var temp = {};
            temp = G.node.get(key);
            temp.count = Number(value).toFixed(2);
            temp.color = "Cyan";
            G.node.set(key, temp);

        }

        /*------ draw Betweenness Centrality ------*/
        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * 10 * size;
                }
            },
            nodeStyle: {
                stroke: 'transparent',
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label + " : " + d.data.count;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120 * distance
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });

    } else {

        var parent_json = get_parent_graph_json();
        var json = parent_json[get_parent_forum_id()];

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

        var snapp_betweenness_centrality = jsnx.betweennessCentrality(G);

        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Betweenness")

        var tr = "<tr></tr>";
        for (var i = 0; i < 2; i++) {
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_betweenness_centrality.entries()) {

            var td = "<td>" + json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + Number(value).toFixed(2) + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

            /*------ modify G ------*/
            var temp = {};
            temp = G.node.get(key);
            temp.count = Number(value).toFixed(2);
            temp.color = "Cyan";
            G.node.set(key, temp);

        }

        /*------ draw Betweenness Centrality ------*/
        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * 10 * size;
                }
            },
            nodeStyle: {
                stroke: 'transparent',
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label + " : " + d.data.count;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120 * distance
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });

    }

    $("#description_details").text("");
    $("#description_details").text("# : Betweenness Centrality View");

});

$("#snapp_eigenvector_btn").on("click", function () {

    $(".overview-wrap").each(function () {
        $(this).hide();
    });
    $(".detail-wrap").each(function () {
        $(this).show();
    });

    var is_all = typeof (get_parent_forum_id()) === "object" ? true : false;

    if (is_all) {

        var parent_json = get_parent_graph_json();
        var id_list = get_parent_forum_id();
        var all_json = [];

        for (var i = 0; i < id_list.length; i++) {

            var jsondata = JSON.parse(JSON.stringify(parent_json[id_list[i]]));

            if (all_json.length === 0) {
                //calculate 0
                all_json[0] = jsondata[0];

                //calculate 1
                all_json[1] = jsondata[1];

                //calculate 2
                all_json[2] = jsondata[2];
            } else {

                for (var item in jsondata[0]) {
                    //calculate 0

                    if (typeof (all_json[0][item]) === "undefined") {
                        all_json[0][item] = jsondata[0][item];
                    } else {
                        all_json[0][item]["size"] += jsondata[0][item]["size"];
                        all_json[0][item]["reply"] += jsondata[0][item]["reply"];
                    }

                }

                for (var item in jsondata[1]) {
                    //calculate 1

                    if (typeof (all_json[1][item]) === "undefined") {
                        all_json[1][item] = jsondata[1][item];
                    } else {
                        all_json[1][item] += jsondata[1][item];
                    }

                }

                for (var item in jsondata[2]) {
                    //calculate 2

                    if (typeof (all_json[2][item]) === "undefined") {
                        all_json[2][item] = jsondata[2][item];
                    } else {
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

        var snapp_eigenvector_centrality = jsnx.eigenvectorCentrality(G);

        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Eigenvector")

        var tr = "<tr></tr>";
        for (var i = 0; i < 2; i++) {
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_eigenvector_centrality.entries()) {

            var td = "<td>" + all_json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + Number(value).toFixed(2) + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

            /*------ modify G ------*/
            var temp = {};
            temp = G.node.get(key);
            temp.count = Number(value).toFixed(2);
            temp.color = "FireBrick";
            G.node.set(key, temp);

        }

        /*------ draw Eigenvector Centrality ------*/
        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * 10 * size;
                }
            },
            nodeStyle: {
                stroke: 'transparent',
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label + " : " + d.data.count;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120 * distance
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });



    } else {

        var parent_json = get_parent_graph_json();
        var json = parent_json[get_parent_forum_id()];

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

        var snapp_eigenvector_centrality = jsnx.eigenvectorCentrality(G);

        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Eigenvector")

        var tr = "<tr></tr>";
        for (var i = 0; i < 2; i++) {
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_eigenvector_centrality.entries()) {

            var td = "<td>" + json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + Number(value).toFixed(2) + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

            /*------ modify G ------*/
            var temp = {};
            temp = G.node.get(key);
            temp.count = Number(value).toFixed(2);
            temp.color = "FireBrick";
            G.node.set(key, temp);

        }

        /*------ draw Eigenvector Centrality ------*/
        jsnx.draw(G, {
            element: '#canvas_details',
            nodeAttr: {
                r: function (d) {
                    // `d` has the properties `node`, `data` and `G`
                    return d.data.count * 10 * size;
                }
            },
            nodeStyle: {
                stroke: 'transparent',
                fill: function (d) {
                    return d.data.color;
                }
            },
            withLabels: true,
            labels: function (d) {
                return d.data.label + " : " + d.data.count;
            },
            stickyDrag: true,
            height: 450,
            layoutAttr: {
                linkDistance: 120 * distance
            },
            edgeStyle: {
                stroke: '#aaa'
            },
            panZoom: {
                enabled: false,
                scale: true
            }
        });

    }

    $("#description_details").text("");
    $("#description_details").text("# : Eigenvector Centrality View");

});

$("#relationship_data").on("click", function () {
    var data = [];

    downloadCSV({ data: data, filename: "relationship-data.csv" });

    var is_all = typeof (get_parent_forum_id()) === "object" ? true : false;

    if (is_all) {

        var parent_json = get_parent_graph_json();
        var id_list = get_parent_forum_id();
        var all_json = [];

        for (var i = 0; i < id_list.length; i++) {

            var jsondata = JSON.parse(JSON.stringify(parent_json[id_list[i]]));

            if (all_json.length === 0) {
                //calculate 0
                all_json[0] = jsondata[0];

                //calculate 1
                all_json[1] = jsondata[1];

                //calculate 2
                all_json[2] = jsondata[2];
            } else {

                for (var item in jsondata[0]) {
                    //calculate 0

                    if (typeof (all_json[0][item]) === "undefined") {
                        all_json[0][item] = jsondata[0][item];
                    } else {
                        all_json[0][item]["size"] += jsondata[0][item]["size"];
                        all_json[0][item]["reply"] += jsondata[0][item]["reply"];
                    }

                }

                for (var item in jsondata[1]) {
                    //calculate 1

                    if (typeof (all_json[1][item]) === "undefined") {
                        all_json[1][item] = jsondata[1][item];
                    } else {
                        all_json[1][item] += jsondata[1][item];
                    }

                }

                for (var item in jsondata[2]) {
                    //calculate 2

                    if (typeof (all_json[2][item]) === "undefined") {
                        all_json[2][item] = jsondata[2][item];
                    } else {
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

        var relationship = jsnx.edgeBetweennessCentrality(G);

        var csv_data = [];

        for (var [key, value] of relationship) {

            var start = "";
            var start_id = "";
            var end = "";
            var end_id = "";

            for (var item in all_json[0]) {

                if (key[0] === all_json[0][item].userid) {
                    start = all_json[0][item].name;
                    start_id = all_json[0][item].userid;
                }

                if (key[1] === all_json[0][item].userid) {
                    end = all_json[0][item].name;
                    end_id = all_json[0][item].userid;
                }
            }

            var reply = 0;
            for (var item in all_json[1]) {
                var temp_start = item.split("_")[0];
                var temp_end = item.split("_")[1];

                if ((start_id === temp_start && end_id === temp_end) || (start_id === temp_end && end_id === temp_start)) {
                    reply = all_json[1][item];
                }
            }

            var temp = {
                start: start,
                end: end,
                weight: value,
                reply: reply
            };

            csv_data.push(temp);

        }

        downloadCSV({ data: csv_data, filename: "relationship-data.csv" });

    } else {

        var parent_json = get_parent_graph_json();
        var json = parent_json[get_parent_forum_id()];

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

        var relationship = jsnx.edgeBetweennessCentrality(G);

        var csv_data = [];

        for (var [key, value] of relationship) {

            var start = "";
            var start_id = "";
            var end = "";
            var end_id = "";

            for (var item in json[0]) {

                if (key[0] === json[0][item].userid) {
                    start = json[0][item].name;
                    start_id = json[0][item].userid;
                }

                if (key[1] === json[0][item].userid) {
                    end = json[0][item].name;
                    end_id = json[0][item].userid;
                }
            }

            var reply = 0;
            for (var item in json[1]) {
                var temp_start = item.split("_")[0];
                var temp_end = item.split("_")[1];

                if ((start_id === temp_start && end_id === temp_end) || (start_id === temp_end && end_id === temp_start)) {
                    reply = json[1][item];
                }
            }

            var temp = {
                start: start,
                end: end,
                weight: value,
                reply: reply
            };

            csv_data.push(temp);

        }

        downloadCSV({ data: csv_data, filename: "relationship-data.csv" });

    }



});

$(document).ready(function () {

    var ex1_p = 0;
    $("#ex1").slider();
    $("#ex1").on("slide", function (slideEvt) {
        $("#ex1SliderVal").text(slideEvt.value);

        var current_number = parseFloat(slideEvt.value);

        var trigger = null;

        if (current_number === ex1_p) {
            trigger = false;
        } else {
            trigger = true;
            ex1_p = current_number;
        }

        if (trigger) {
            size = current_number;
            $("#snapp_degree_btn").trigger("click");
        }

    });

    var ex1_1_p = 0;
    $("#ex1_1").slider();
    $("#ex1_1").on("slide", function (slideEvt) {
        $("#ex1_1SliderVal").text(slideEvt.value);

        var current_number = parseFloat(slideEvt.value);

        var trigger = null;

        if (current_number === ex1_1_p) {
            trigger = false;
        } else {
            trigger = true;
            ex1_1_p = current_number;
        }

        if (trigger) {
            distance = current_number;
            $("#snapp_degree_btn").trigger("click");
        }

    });

    var ex2_p = 0;
    $("#ex2").slider();
    $("#ex2").on("slide", function (slideEvt) {
        $("#ex2SliderVal").text(slideEvt.value);

        var current_number = parseFloat(slideEvt.value);

        var trigger = null;

        if (current_number === ex2_p) {
            trigger = false;
        } else {
            trigger = true;
            ex2_p = current_number;
        }

        if (trigger) {
            size = current_number;
            $("#snapp_closeness_btn").trigger("click");
        }

    });

    var ex2_1_p = 0;
    $("#ex2_1").slider();
    $("#ex2_1").on("slide", function (slideEvt) {
        $("#ex2_1SliderVal").text(slideEvt.value);

        var current_number = parseFloat(slideEvt.value);

        var trigger = null;

        if (current_number === ex2_1_p) {
            trigger = false;
        } else {
            trigger = true;
            ex2_1_p = current_number;
        }

        if (trigger) {
            distance = current_number;
            $("#snapp_closeness_btn").trigger("click");
        }

    });

    var ex3_p = 0;
    $("#ex3").slider();
    $("#ex3").on("slide", function (slideEvt) {
        $("#ex3SliderVal").text(slideEvt.value);

        var current_number = parseFloat(slideEvt.value);

        var trigger = null;

        if (current_number === ex3_p) {
            trigger = false;
        } else {
            trigger = true;
            ex3_p = current_number;
        }

        if (trigger) {
            size = current_number;
            $("#snapp_betweenness_btn").trigger("click");
        }

    });

    var ex3_1_p = 0;
    $("#ex3_1").slider();
    $("#ex3_1").on("slide", function (slideEvt) {
        $("#ex3_1SliderVal").text(slideEvt.value);

        var current_number = parseFloat(slideEvt.value);

        var trigger = null;

        if (current_number === ex3_1_p) {
            trigger = false;
        } else {
            trigger = true;
            ex3_1_p = current_number;
        }

        if (trigger) {
            distance = current_number;
            $("#snapp_betweenness_btn").trigger("click");
        }

    });

    var ex4_p = 0;
    $("#ex4").slider();
    $("#ex4").on("slide", function (slideEvt) {
        $("#ex4SliderVal").text(slideEvt.value);

        var current_number = parseFloat(slideEvt.value);

        var trigger = null;

        if (current_number === ex4_p) {
            trigger = false;
        } else {
            trigger = true;
            ex4_p = current_number;
        }

        if (trigger) {
            size = current_number;
            $("#snapp_eigenvector_btn").trigger("click");
        }

    });

    var ex4_1_p = 0;
    $("#ex4_1").slider();
    $("#ex4_1").on("slide", function (slideEvt) {
        $("#ex4_1SliderVal").text(slideEvt.value);

        var current_number = parseFloat(slideEvt.value);

        var trigger = null;

        if (current_number === ex4_1_p) {
            trigger = false;
        } else {
            trigger = true;
            ex4_1_p = current_number;
        }

        if (trigger) {
            distance = current_number;
            $("#snapp_eigenvector_btn").trigger("click");
        }

    });
})

function get_parent_graph_json() {
    return graph_json;
}

function get_parent_forum_id() {

    return forum_choose_id;
}

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args) {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
        data: args.data
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}
