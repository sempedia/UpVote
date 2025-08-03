from django.urls import path
from . import views

urlpatterns = [
    # Feature CRUD
    path('features/', views.FeatureListCreateView.as_view(), name='feature-list-create'),
    path('features/<int:pk>/', views.FeatureDetailView.as_view(), name='feature-detail'),

    # Voting endpoints
    path('features/<int:pk>/upvote/', views.upvote_feature, name='feature-upvote'),
    path('features/<int:pk>/remove-vote/', views.remove_vote, name='feature-remove-vote'),

    # Stats endpoint
    path('features/<int:pk>/stats/', views.feature_stats, name='feature-stats'),
]