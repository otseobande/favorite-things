from rest_framework.test import APIClient
import pytest
import json

from api.models import Category, FavoriteThing

@pytest.mark.django_db
def test_create_favorite_thing(client):
    category = Category(name="Food")
    category.save()

    favorite_thing = FavoriteThing(
        title="Rice",
        category=category,
        ranking=1)
    favorite_thing.save()

    another_favorite_thing = FavoriteThing(
        title="Rice",
        category=category,
        ranking=2)
    another_favorite_thing.save()

    response = client.delete(
        '/api/v1/favorite-things/{}/'.format(str(favorite_thing.id)),
        content_type='application/json'
    )

    assert response.status_code == 204

    another_favorite_thing.refresh_from_db()

    assert another_favorite_thing.ranking == 1
