from django import forms
from .models import SingleContent, Course
from django.core.validators import MinValueValidator, MaxValueValidator

class RegisterForm(forms.Form):
    username = forms.CharField(max_length=150, widget=forms.TextInput(attrs={'class': 'form-control', 'autofocus': True}), label='Username')
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}), label='Email Address')
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), label='Password')
    confirmation = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), label='Confirm Password')

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150,
                               widget=forms.TextInput(attrs={'class': 'form-control', 'autofocus': True}),
                               label='Username')
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), label='Password')


class CreateTeacherForm(forms.Form):
    headline = forms.CharField(max_length=200, label="Headline:")
    about=forms.CharField(label="Write something about you:",widget=forms.Textarea())
    twitter = forms.URLField(max_length=200,label="Twitter link:",required=False)
    linkedin = forms.URLField(max_length=200,label="Linkedin link:",required=False)
    instagram = forms.URLField(max_length=200,label="Instagram link:",required=False)


class SingleContentForm(forms.ModelForm):
    class Meta:
        model=SingleContent
        fields = ['title', 'description', 'url_youtube', 'url_image', 'category', 'is_free']

    def save(self, commit=True, user=None):
        instance = super().save(commit=False)
        if user:
            instance.user = user
        if commit:
            instance.save()
        return instance

class CourseForm(forms.ModelForm):
    # content = forms.ModelMultipleChoiceField(queryset=SingleContent.objects.all(), required=False)
    price = forms.DecimalField(validators=[MinValueValidator(0), MaxValueValidator(500)])
    class Meta:
        model=Course
        fields = ['name','overview','url_image','category','price','language']

        # def clean_price(self):
        #     price = self.cleaned_data.get('price')
        #     # Validate if price is within desired range
        #     if price < 0:
        #         raise forms.ValidationError("Price must be a non-negative value.")
        #     elif price > 10000:  # Change the upper limit as per your requirement
        #         raise forms.ValidationError("Price cannot exceed 10,000.")
        #     return price
