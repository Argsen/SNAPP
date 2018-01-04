/**
 * @file: tab_iframe.js
 * @author: Max Gong <max.g.laboratory@gmail.com>
 */

/*------ three overview various ------*/
$("#snapp_load_network_centrality_chart").on("click", function () {

    if (get_parent_forum_id() === -1) {
        alert("please choose forum");
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
            element: '#canvas',
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

    //analysis
    var snapp_average_clustering = jsnx.averageClustering(G);
    var snapp_transitivity = jsnx.transitivity(G);
    var snapp_density = jsnx.density(G);

    $("#snapp_iframe_average_clustering").text("");
    $("#snapp_iframe_average_clustering").text(snapp_average_clustering);
    $("#snapp_iframe_transitivity").text("");
    $("#snapp_iframe_transitivity").text(snapp_transitivity);
    $("#snapp_iframe_density").text("");
    $("#snapp_iframe_density").text(snapp_density);

});

/*------ bind event to four type of Centrality ------*/
$("#snapp_degree_btn").on("click", function () {

    if (get_parent_forum_id() === -1) {
        alert("please choose forum");
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
                return d.data.count * 3;
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

    $("#description_details").text("");
    $("#description_details").text("# : Degree Centrality View");
});

$("#snapp_closeness_btn").on("click", function () {

    if (get_parent_forum_id() === -1) {
        alert("please choose forum");
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

        var centrality = 1.0 / sum;

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
                return d.data.count*10;
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

    $("#description_details").text("");
    $("#description_details").text("# : Closeness Centrality View");

});

$("#snapp_betweenness_btn").on("click", function () {

    if (get_parent_forum_id() === -1) {
        alert("please choose forum");
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
                return d.data.count * 10;
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

    $("#description_details").text("");
    $("#description_details").text("# : Betweenness Centrality View");

});

$("#snapp_eigenvector_btn").on("click", function () {

    if (get_parent_forum_id() === -1) {
        alert("please choose forum");
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
                return d.data.count * 10;
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

    $("#description_details").text("");
    $("#description_details").text("# : Eigenvector Centrality View");

});

function get_parent_graph_json() {
    return parent.graph_json;
}

function get_parent_forum_id() {
    return parent.forum_choose_id;
}