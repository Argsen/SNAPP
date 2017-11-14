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
     * table 
     */

    setTimeout(function () {
        $('#example').DataTable({
            "order": [[3, "desc"]]
        });
    }, 1000);

});