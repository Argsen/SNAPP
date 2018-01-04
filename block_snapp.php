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

defined('MOODLE_INTERNAL') || die();

class block_snapp extends block_base
{

    public function init()
    {
        $this->title = get_string('snapp', 'block_snapp');
    }

    /*------ show add snapp block in forum level ------*/
    public function applicable_formats()
    {
        return array('all' => true);
    }

    public function get_content()
    {

        global $CFG,
               $DB;
        
        $course = $this->page->course;

        if ($this->content !== null) {
            return $this->content;
        }

        $this->content         =  new stdClass;
        $this->content->text   = 'Welcome using snapp plugin';
        
        $this->content->text .= "<br><br><a href= {$CFG->wwwroot}/blocks/snapp/snapp_d3_chart.php?id={$course->id}
        target=_blank><button>" . get_string('snapp', 'block_snapp') . "</button></a><br><br>";

        $this->content->footer = 'snapp plugin version 1.2.0';
     
        return $this->content;
    }
}
