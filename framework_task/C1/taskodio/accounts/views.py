from django.http import HttpResponse
from django.template import Context, loader

def signin(request):
	title = 'this is the signin page'
	template = loader.get_template('accounts/signin.html')
	context = Context({
		'title': title,
	})
	return HttpResponse(template.render(context))

def signup(request):
	title = 'this is the signup page'
	template = loader.get_template('accounts/signup.html')
	context = Context({
		'title': title,
	})
	return HttpResponse(template.render(context))