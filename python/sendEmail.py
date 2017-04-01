import smtplib, getpass

def sendEmail(fromaddr, toaddrs, pswd):
	message = """From: From Person <from@fromdomain.com>
	To: To Person <to@todomain.com>
	Subject: SMTP e-mail test

	This is a test e-mail message.
	"""

	try:
		server = smtplib.SMTP('smtp.gmail.com:587')
		server.starttls()
		server.login(fromaddr,pswd)
		server.sendmail(fromaddr, toaddrs, message)
		server.quit()     
		print("Successfully sent email ")
	except SMTPException:
	   print("Error: unable to send email ")

fromaddr = input('Please enter your email ')	   
pswd = getpass.getpass('Password: ')
toaddrs = input('Please enter the email you wish to send to ')
sendEmail(fromaddr, toaddrs, pswd)