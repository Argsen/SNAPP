/**
 * @package   snapp
 * @copyright 2017, Max Gong <max.gong@unisa.edu.au>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$(document).ready(function(){
    
    /**
     * create tabs
     */
    $('.tabs').tabslet();

    /**
     * reload iframe
     */

    $("#snapp_reload_iframe, #snapp_network_centrality").on("click", function(){

        $('iframe').each(function() {
            this.contentWindow.location.reload(true);
          });
    });


});
