
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


/**
 * Get all forums with course id
 *
 * @param int $cid course id
 * @return array all forum in the course
 */
function snapp_get_forumoptions($cid) {
    global $DB;
    $forumoptions = array();
    if ($course = $DB->get_record('course', array('id'=>$cid))) {
        if ($forums = $DB->get_records('forum', array('course'=>$cid), 'id DESC')) {
            foreach ($forums as $forum) {
                $cm = get_coursemodule_from_instance("forum", $forum->id, $cid);
                $context = context_module::instance($cm->id);
                if (has_capability('mod/forum:addinstance', $context)) {
                    if ($DB->record_exists('forum_discussions', array('forum'=>$forum->id))) {
                        $forumoptions[$forum->id] = $forum->name;
                    }
                }
            }
        } else {
            $forumoptions[0] = get_string('noforumincourse', 'block_snapp');
        }
    }
    return $forumoptions;
}

/**
 * Generate node and edge arrays by analysing all forum posts
 * Node is the author, edge is the interaction (i.e. reply)
 * An array used for mapping used id to array index is also returned
 *
 * @param int $fid forum id
 * @return array 3 arrays: nodes, edges and user id mapping
 */
function snapp_get_d3_json($fid) {
    global $DB;
    //echo $fid;
    if ($forum = $DB->get_record('forum', array('id'=>$fid))) {
        if ($dids = $DB->get_records('forum_discussions', array('forum'=>$fid), '', 'id')) {
            $discussion_ids = array();
            foreach ($dids as $d) {
                $discussion_ids[] = $d->id;
            }
            list($in_sql, $in_params) = $DB->get_in_or_equal($discussion_ids, SQL_PARAMS_NAMED);
            $select = "discussion $in_sql";
            if ($posts = $DB->get_records_select('forum_posts', $select, $in_params)) {
                $context = context_course::instance($forum->course);
                $nodes = array();
                $edges = array();
                $uid_mapping = array();
                $count = 0;
                foreach ($posts as $post) {
                    $author = $DB->get_record('user', array('id'=>$post->userid));
                    $sql = "SELECT roleid FROM {role_assignments} WHERE userid = :userid AND contextid = :contextid GROUP BY userid";
                    $authorrole = $DB->get_field_sql($sql, array('userid'=>$post->userid, 'contextid'=>$context->id));
                    
                    // nodes array
                    if (!isset($nodes[$author->id])) {
                        $nodes[$author->id]['name'] = $author->lastname." ".$author->firstname;
                        $nodes[$author->id]['userid'] = $author->id;
                        $nodes[$author->id]['size'] = 1;
                        $nodes[$author->id]['discussion'] = $post->parent ? 0:1;
                        $nodes[$author->id]['reply'] = $post->parent ? 1:0;
                        $nodes[$author->id]['group'] = ($authorrole==5)?1:5;
                        $uid_mapping[$author->id] = $count;
                        $count++;
                    } else {
                        $nodes[$author->id]['size']++;
                        if (!($post->parent)) $nodes[$author->id]['discussion']++ ;
                        if ($post->parent) $nodes[$author->id]['reply']++;
                    }
                    
                    // edges array
                    if ($post->parent) {
                        $parent = $posts[$post->parent];
                        if ($post->userid != $parent->userid) {
                            if (!isset($edges[$post->userid."_".$parent->userid]) && !isset($edges[$parent->userid."_".$post->userid])) {
                                $edges[$post->userid."_".$parent->userid] = 1;
                            } else {
                                if (isset($edges[$post->userid."_".$parent->userid])) {
                                    $edges[$post->userid."_".$parent->userid]++;
                                } else {
                                    $edges[$parent->userid."_".$post->userid]++;
                                }
                            }
                        }
                    }
                }
                $return = array($nodes, $edges, $uid_mapping);
                return $return;
            }
        }
    }
    return false;
}