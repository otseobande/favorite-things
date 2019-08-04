from django.db import models
from django.contrib.postgres.fields import JSONField, CICharField
from auditlog.registry import auditlog
from auditlog.models import AuditlogHistoryField
import uuid

# Create your models here.
class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    history = AuditlogHistoryField(pk_indexable=False)

    class Meta:
        abstract = True

class Category(BaseModel):
    name = CICharField(max_length=30, unique=True)

class FavoriteThing(BaseModel):
    title = models.CharField(max_length=30)
    description = models.TextField(blank=True, null=True)
    ranking = models.IntegerField(null=True)
    metadata = JSONField(blank=True, null=True)
    category = models.ForeignKey(Category, related_name='favorite_things', on_delete=models.CASCADE)

    class Meta:
        ordering = ('ranking', )

auditlog.register(Category, exclude_fields=['modified'])
auditlog.register(FavoriteThing, exclude_fields=['modified'])
