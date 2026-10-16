from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProtectedStudentViewSet, 
    ProtectedGroupViewSet,
    UserPictureViewSet, 
    UserAvatarViewSet
)

router = DefaultRouter()
router.register(r'users', ProtectedStudentViewSet, basename='users')
router.register(r'groups', ProtectedGroupViewSet, basename='groups')

urlpatterns = [
    path('users/pictures/', UserPictureViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='user-pictures'),
    path('users/pictures/<int:pk>/', UserPictureViewSet.as_view({
        'delete': 'destroy'
    }), name='user-picture-detail'),

    path('users/avatar/', UserAvatarViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='user-avatars'),
    path('users/avatar/<int:pk>/', UserAvatarViewSet.as_view({
        'delete': 'destroy'
    }), name='user-avatar-detail'),

    path('', include(router.urls)),
]
