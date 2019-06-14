<?php  
/**
* @package KanwatPlugin
*/
/*
Plugin Name: Kanwat plugin
Plugin URI: http://knwat.com
Description: This is my first plugin
Version: 1.0.0
Author: Omar Jamal
*/
if (!defined('ABSPATH')) {
	die('');
}

/**
 * 
 */
class KanwatPlugin 
{
	function __construct(){
		add_action('init',array($this,'custom_post_type'));
	}

	function activate(){
		// generated a CPT
		$this->custom_post_type();
		// flush rewrite rules
		flush_rewrite_rules();
	}
	function deactivate(){
		// flush rewrite rules

	}
	function uninstall(){
		// delete CPT 
		// delete all the plugin data from the DB
	}
	function custom_post_type(){
		register_post_type('book', ['public' => 'true', 'label'=>'books']);
	}
}

if (class_exists('KanwatPlugin')) {
	$kanwatplugin = new KanwatPlugin();
}

//activation
register_activation_hook(__FILE__, array($kanwatplugin,'activate'));
//deactivation
register_deactivation_hook(__FILE__, array($kanwatplugin,'deactivate'));

//uninstall

//[my_random_products]
function my_random_products_func( $args ){ 
		
?>
	<ul class="products">
	    <?php
			$args = array(
				'post_type' => 'product',
			    'orderby' => 'rand',
				'posts_per_page' => 3
			 );
			 $loop = new WP_Query( $args );
		
			 if ( $loop->have_posts() ) {

			 	while ( $loop->have_posts() ) : $loop->the_post();
					 wc_get_template_part( 'content', 'product' );
				endwhile;
			 }  

			else {
			 	echo __( 'No products found' );
			 }

			 wp_reset_postdata();
		?>
	</ul>
		<?php
}

add_shortcode( 'my_random_products', 'my_random_products_func' );
