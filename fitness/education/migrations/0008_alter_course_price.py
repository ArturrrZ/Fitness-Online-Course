# Generated by Django 5.0.2 on 2024-03-15 18:40

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0007_course_current_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='price',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(500)]),
        ),
    ]
