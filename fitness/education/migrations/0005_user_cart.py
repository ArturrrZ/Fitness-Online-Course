# Generated by Django 5.0.2 on 2024-03-10 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0004_participation_is_completed_alter_user_headline_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='cart',
            field=models.ManyToManyField(blank=True, null=True, related_name='in_users_cart', to='education.course'),
        ),
    ]
