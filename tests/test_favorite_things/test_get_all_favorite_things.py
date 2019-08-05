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

    response = client.get(
        '/api/v1/favorite-things/',
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 200
    assert content['count'] == 1
    assert content['next'] == None
    assert content['previous'] == None
    assert any(str(favorite_thing.id) == result['id'] for result in content['results'])
