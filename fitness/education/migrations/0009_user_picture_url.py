# Generated by Django 5.0.2 on 2024-02-22 22:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0008_alter_participation_participant'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='picture_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
