<?php

$title="Newsletter Signup";
$styles = array('input');
$content= "";
	
$success = TRUE;

$error_message = "";

$name = "";
$email = "";

if(isset($_POST['email'])) {
 
    $email_to = "contact@babelcompany.net";
    $email_subject = "newsletter signup";
 
    function died($error) {
		global $error_message;
		global $success;
		
		//$error_message .= '<label id="error">' . $error . '</label>';
		$error_message .= $error . '.<br />';
        $success = FALSE;
    }
 
    if( !isset($_POST['name'])) {
		died('No name entered');
	} else if(strlen($_POST['name']) <= 0 ) {
        died('No name entered');  
    } else {
		$name = $_POST['name'];
		$string_exp = "/^[A-Za-z .'-]+$/";
	 
		if(!preg_match($string_exp,$name)) {
			//$die'Invalid Name.<br />';
			died('Invalid name');
		}
	}
	
	if( !isset($_POST['email']) ) {
        died('No email entered');       
    } else if(strlen($_POST['email']) <= 0 ) {
        died('No email entered');  
    } else {
		$email = $_POST['email'];
		$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
		
		if(!preg_match($email_exp,$email)) {
			//$error_message .= 'Invalid Email Address.<br />';
			died('Invalid email');
		}
		
	}
	 
	if(strlen($error_message) <= 0) {
 
		$email_message = "";
		 
		function clean_string($string) {
			$bad = array("content-type","bcc:","to:","cc:","href");
			return str_replace($bad,"",$string);
		}
	 
		$email_message .= "Name: ".clean_string($name)."\n";
		$email_message .= "Email: ".clean_string($email)."\n";
		
		// create email headers
		//$headers = 'From: '.$email_from."\r\n".
		$headers = 'From: contact@babelcompany.net'."\r\n".
		'Reply-To: '.$email."\r\n" .
		'X-Mailer: PHP/' . phpversion();
		@mail($email_to, $email_subject, $email_message, $headers);  
	}
}else{
	$success = FALSE;
}



if($success){
	$content.= 
		'<div class="info">
			<p>Thank you for your interest. We will be contacting you soon.</p>
		</div>';
} else {
	$content.=
	'<form id="form" method="post" action="newsletter.php">';
	
	if(strlen($error_message) > 0) {
		$content.= 
		'<label id="error" for="submit" class="info">' . $error_message .'</label>
		
		<script>
			window.onload = function (){
				var element = document.getElementById("error");
				element.style.display = "inline";
			};
		</script>
		';
	}
	
	$content.=
		'<label for="name">Name</label>
		<input  type="text" name="name" maxlength="50" size="30" value="' . $name . '" >
		<label for="email">Email</label>
		<input  type="text" name="email" maxlength="80" size="30" value="' . $email . '">
		<input type="submit" value="Submit">
	</form>
	';
}

include 'php/default.php';

?>		
