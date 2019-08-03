from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from .  import models
from . import serializers

# Create your views here.
class FavoriteThingViewSet(viewsets.ModelViewSet):
    queryset = models.FavoriteThing.objects.all()
    serializer_class = serializers.FavoriteThingSerializer
    permission_classes = [permissions.AllowAny]

    def partial_update(self, request, pk=None):
        favorite_thing = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(favorite_thing, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        selected_favorite_thing = get_object_or_404(self.queryset, pk=pk)

        favorite_things_with_lower_ranking = (
            models
            .FavoriteThing
            .objects
            .filter(
                category=selected_favorite_thing.category,
                ranking__gt=selected_favorite_thing.ranking)
        )

        for favorite_thing in favorite_things_with_lower_ranking:
            favorite_thing.ranking = favorite_thing.ranking - 1
            favorite_thing.save()

        selected_favorite_thing.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.prefetch_related('favorite_things')
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.AllowAny]
