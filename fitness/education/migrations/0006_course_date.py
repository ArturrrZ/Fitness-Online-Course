# Generated by Django 5.0.2 on 2024-03-12 00:25

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0005_user_cart'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2024, 3, 11, 17, 25, 27, 741859)),
            preserve_default=False,
        ),
    ]