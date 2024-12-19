<!DOCTYPE html>

<html>
	<head>
		<title>
		<?php
		if(!isset($title)){
			$title= "Babel Company";
		}
		echo $title ?>
		</title>
		 <meta charset="UTF-8"> 
		<link type="text/css" rel="stylesheet" href="css/reset.css" media="all" />
		<link type="text/css" rel="stylesheet" href="css/default.css" media="all" />
		<link type="text/css" rel="stylesheet" href="css/cookies.css" media="all" />
<?php
		if(isset($styles)){
			foreach($styles as &$style){
				echo '		<link type="text/css" rel="stylesheet" href="css/'.$style.'.css" media="all" />'. PHP_EOL;
			}
		}
?>

	</head>
	
	<body>	
		<header>	
			<div id="babelLogoHead" onclick="ToPage('index.php'); return false;"></div>
			<div id="navButton" onclick="ToggleId('myNav'); return false;"></div>
			
			<nav id="myNav">
				<div><a href="offers.php">Offers</a></div>
				<div><a href="partner.php">Partner</a></div>
				<div><a href="user.php">User</a></div>
				<div><a href="newsletter.php">Newsletter</a></div>
				<div><a href="search.php">Search</a></div>
			</nav>			
		</header>
		
		
		<?php//if(isset($extra)){ echo $extra; } ?>
		<?php echo file_get_contents("html/cookies.html") ?>
		
		<div id="content">
			<div id="container">
			
				<h1 id="title"><?php echo $title ?></h1>
				
				<?php if(isset($content)){ echo $content; } ?>
				
			</div>
		</div>
		
		<footer>
			<div id = "babelLogoFoot" onclick="ToPage('index.php'); return false;"></div>
			
			<div id="footerInfo">
			
				<div id = "legal">
					<ul>
						<li><a href="about.php">About Babel</a></li>
						<li><a href="#" onclick="ToggleId('cookiePopup'); return false;">Cookies</a></li>
						<!--<li><a href="teams.php">Teams</a></li>-->
						<li><a href="privacy.php">Privacy</a></li>
					</ul>
				</div>
				
				<div id= "navigationFoot">
					<ul>
						<li><a href="map.php">Site Map</a></li>
						<li><a href="partner.php">Partner Contacts</a></li>
						<li><a href="contact.php">CONTACT US</a></li>
						<li><a href="responsible.php">Responsibility</a></li>
					</ul>
				</div>
				
				
				
				<div class = "social">
					<!--<a href="index.php" id="linkedin" ></a>
					<a href="#" id="facebook"></a>-->
					<a href="https://twitter.com/thebabelcompany" id="twitter"></a>
					<!--<a href="#" id="instagram"></a>-->
					<a href="https://www.youtube.com/channel/UCwEyqdk3bIqAIwzfqRNMHyw/" id="youtube"></a>
					<!--<a href="#" id="snapchat"></a>-->
				</div>
			
			</div>
				
		</footer>
		
		<script>
			function ToggleId(string) {
				var element = document.getElementById(string);
				//if (element.style.display === "flex") {
				if (window.getComputedStyle(element,null).getPropertyValue("display") == "flex") {
					element.style.display = "none";
				} else {
					element.style.display = "flex";
				}
			}

			function ToPage(string){
				window.location.href = string;
			}
		</script>

	</body>		
</html>