from rest_framework.test import APIClient
import pytest
import json

from api.models import Category

@pytest.mark.django_db
def test_create_favorite_thing_validation(client):
    response = client.post(
        '/api/v1/favorite-things/',
        {},
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 400
    assert content ==  {
        'category': ['This field is required.'],
        'title': ['This field is required.']
    }

@pytest.mark.django_db
def test_create_favorite_thing(client):
    category = Category(name="Food")
    category.save()

    response = client.post(
        '/api/v1/favorite-things/',
        {
            'title': 'Rice',
            'category': str(category.id),
            'ranking': 1
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 201
    assert content['title'] ==  'Rice'
    assert content['category'] == str(category.id)

@pytest.mark.django_db
def test_create_favorite_thing_without_ranking(client):
    category = Category(name="Food")
    category.save()

    response = client.post(
        '/api/v1/favorite-things/',
        {
            'title': 'Rice',
            'category': str(category.id),
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 201
    assert content['title'] ==  'Rice'
    assert content['category'] == str(category.id)
    assert content['ranking'] == 1


@pytest.mark.django_db
def test_create_favorite_thing_with_out_of_range_ranking_number(client):
    category = Category(name="Food")
    category.save()

    response = client.post(
        '/api/v1/favorite-things/',
        {
            'title': 'Rice',
            'category': str(category.id),
            'ranking': 4
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 400
    assert content == { 'ranking': ['number is out of ranking range'] }
