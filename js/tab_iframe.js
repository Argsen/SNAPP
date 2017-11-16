// var G = new jsnx.Graph();

// // G.addWeightedEdgesFrom([[2,3,10]]);
// // G.addStar([3,4,5,6], {weight: 5}); 
// // G.addStar([2,1,0,-1], {weight: 3});

// G.addNode(1, {count: 12});
// G.addNode(2, {count: 8});
// G.addNode(3, {count: 15});
// G.addEdgesFrom([[1,2],[2,3]]);

// jsnx.draw(G, {
//    element: '#canvas',  
//    weighted: true,
//    edgeStyle: {
//        'stroke-width': 10
//    }
// });

$("#snapp_load_network_centrality_chart").on("click", function(){

    if(get_parent_forum_id() === -1){
        alert("please choose forum");
    }else{
        var parent_json = get_parent_graph_json();
        var json = parent_json[get_parent_forum_id()];

        var G = new jsnx.Graph();

        for(var item in json[0]){
            G.addNode(item, {count: json[0][item].size, color: 'red', label: json[0][item].name});
        }

        var edges_arr = []
        for(var item in json[1]){
            var source = item.split("_")[0];
            var target = item.split("_")[1];

            G.addEdge(source, target);
        }

        jsnx.draw(G, {
            element: '#canvas', 
            nodeAttr: {
              r: function(d) {
                // `d` has the properties `node`, `data` and `G`
                return d.data.count*2;
              }
            },
            nodeStyle: {
                fill: function(d) { 
                    return d.data.color; 
                }
            },
            withLabels: true,
            labels: function(d) { 
                return d.data.label; 
            },
            stickyDrag: true
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

    /*------ bind event to four type of Centrality ------*/

    var snapp_degree = jsnx.degree(G);

    $("#snapp_degree_btn").on("click", function(){
        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Degree")

        var tr = "<tr></tr>";
        for(var i =0; i< 2; i++){
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_degree.entries()) {

            var td = "<td>" + json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + value + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

        }
        
    });
    
    var snapp_closeness = jsnx.edgeBetweennessCentrality(G);

    $("#snapp_closeness_btn").on("click", function(){
        $("#snapp_tab_3_table").empty();
        
        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Closeness")

        var tr = "<tr></tr>";
        for(var i =0; i< 2; i++){
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_closeness.entries()) {

            var source = key[0];
            var target = key[1];

            var td = "<td>" + json[0][source].name + " <strong>to</strong> " + json[0][target].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + value + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);
        }

    });
    
    var snapp_betweenness_centrality = jsnx.betweennessCentrality(G);

    $("#snapp_betweenness_btn").on("click", function(){
        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Betweenness")

        var tr = "<tr></tr>";
        for(var i =0; i< 2; i++){
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_betweenness_centrality.entries()) {

            var td = "<td>" + json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + value + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

        }
        
    });

    var snapp_eigenvector_centrality = jsnx.eigenvectorCentrality(G);

    $("#snapp_eigenvector_btn").on("click", function(){
        $("#snapp_tab_3_table").empty();

        $("#snapp_tab_3_table_title").text("");
        $("#snapp_tab_3_table_title").text("Eigenvector")

        var tr = "<tr></tr>";
        for(var i =0; i< 2; i++){
            $("#snapp_tab_3_table").append(tr);
        }

        for (var [key, value] of snapp_eigenvector_centrality.entries()) {

            var td = "<td>" + json[0][key].name + "</td>";
            $("#snapp_tab_3_table tr").eq(0).append(td);

            var td = "<td>" + value + "</td>";
            $("#snapp_tab_3_table tr").eq(1).append(td);

        }
        
    });

});

function get_parent_graph_json(){
    return parent.graph_json;
}

function get_parent_forum_id(){
    return parent.forum_choose_id;
}