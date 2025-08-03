from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def healthcheck(request):
    return JsonResponse({"status": "healthy", "service": "upvote-backend"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('features.urls')),
    path('health/', healthcheck, name='health'),
]