$(document).ready(function() {
	$('.submit').click(function(event) {
		
		var name = $('.name').val()
		var email = $('.email').val()
		var message = $('.message').val()
		var val = $('.validate')
		val.empty()
		
		if(name.length<1)
		{
			event.preventDefault()
			val.append('<div>**Name can&#39t be empty</div>')
		}
		
		if(email.length>5 && email.includes('@') && email.includes('.')){}
		else
		{
			event.preventDefault()
			val.append('<div>**Enter valid email</div>')
		}
		
		if(message.length<1)
		{
			event.preventDefault()
			val.append('<div>**Message can&#39t be empty</div>')
		}
	})
})
