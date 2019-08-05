from rest_framework.test import APIClient
import pytest
import json

from api.models import Category

@pytest.mark.django_db
def test_create_category(client):
    response = client.post(
        '/api/v1/categories/',
        {
            'name': 'Test Category'
        },
        format='json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 201
    assert content['name'] == 'Test Category'

@pytest.mark.django_db
def test_get_categories(client):
    category = Category(name='Test category')
    category.save()

    response = client.get(
        '/api/v1/categories/',
        format='json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 200
    assert content['count'] == 1
    assert content['next'] == None
    assert content['previous'] == None
    assert any(str(category.id) == result['id'] for result in content['results'])

@pytest.mark.django_db
def test_get_a_category(client):
    category = Category(name='Test category')
    category.save()

    response = client.get(
        '/api/v1/categories/{}/'.format(str(category.id)),
        format='json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 200
    assert content['id'] == str(category.id)

@pytest.mark.django_db
def test_update_a_category(client):
    category = Category(name='Test category')
    category.save()

    response = client.patch(
        '/api/v1/categories/{}/'.format(str(category.id)),
        json.dumps({
            'name': 'Updated Name'
        }),
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 200
    assert content['name'] == 'Updated Name'

@pytest.mark.django_db
def test_delete_a_category(client):
    category = Category(name='Test category')
    category.save()

    response = client.delete(
        '/api/v1/categories/{}/'.format(str(category.id)),
        content_type='application/json'
    )

    assert response.status_code == 204

