from django.urls import path
from django.conf.urls import include, url
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'favorite-things', views.FavoriteThingViewSet)
router.register(r'categories', views.CategoryViewSet)

urlpatterns = [
    path('v1/', include(router.urls))
]
